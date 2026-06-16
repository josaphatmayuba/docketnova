const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Secret pour signer les jetons d'accès démo (HMAC). Réutilise ADMIN_KEY si pas défini.
const ACCESS_SECRET = process.env.ACCESS_SECRET || process.env.ADMIN_KEY || 'change-me';
const ACCESS_TTL_MS = 1000 * 60 * 60 * 8; // 8 heures
const COOKIE_NAME = 'dn_access';

// Crée un jeton signé "<expiry>.<hmac>"
function makeToken() {
  const exp = Date.now() + ACCESS_TTL_MS;
  const sig = crypto.createHmac('sha256', ACCESS_SECRET).update(String(exp)).digest('hex');
  return `${exp}.${sig}`;
}

// Vérifie un jeton (signature valide + non expiré)
function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const [expStr, sig] = token.split('.');
  if (!expStr || !sig) return false;
  const expected = crypto.createHmac('sha256', ACCESS_SECRET).update(expStr).digest('hex');
  // comparaison à temps constant
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(expStr) > Date.now();
}

// Lit un cookie depuis l'en-tête
function readCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

app.use(cors({ origin: ['http://docketnova.com', 'https://docketnova.com', 'http://www.docketnova.com', 'https://www.docketnova.com'], credentials: true }));
app.use(express.json());

app.post('/api/demo', async (req, res) => {
  const { type, nom, email, organisation, telephone, message, role, langue } = req.body;

  if (!type || !nom || !email) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
  if (!['entreprise', 'personnel', 'universite'].includes(type)) {
    return res.status(400).json({ error: 'Type invalide.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Courriel invalide.' });
  }
  const validRole = (role && ['etudiant', 'professeur'].includes(role)) ? role : null;

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  try {
    await pool.query(
      `INSERT INTO demo_requests (type, nom, email, organisation, telephone, message, role, langue, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [type, nom.trim(), email.trim().toLowerCase(), organisation?.trim() || null,
       telephone?.trim() || null, message?.trim() || null, validRole, langue || 'fr', ip]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.post('/api/verify-code', async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code manquant.' });
  }

  const clean = code.trim().toUpperCase();

  try {
    const result = await pool.query(
      `SELECT id, label, max_uses, use_count, expires_at
       FROM demo_codes WHERE code = $1`,
      [clean]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Code invalide.' });
    }

    const row = result.rows[0];

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return res.status(403).json({ error: 'Code expiré.' });
    }

    if (row.use_count >= row.max_uses) {
      return res.status(403).json({ error: 'Code déjà utilisé.' });
    }

    await pool.query(
      `UPDATE demo_codes SET use_count = use_count + 1 WHERE id = $1`,
      [row.id]
    );

    // Pose un cookie de session signé qui autorise l'accès à /app/
    const token = makeToken();
    res.setHeader('Set-Cookie',
      `${COOKIE_NAME}=${token}; Path=/; Max-Age=${Math.floor(ACCESS_TTL_MS / 1000)}; HttpOnly; SameSite=Lax`
    );

    res.json({ ok: true, label: row.label || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Endpoint interne pour nginx auth_request — vérifie le cookie d'accès.
// 200 = autorisé, 401 = refusé.
app.get('/api/check-access', (req, res) => {
  const token = readCookie(req, COOKIE_NAME);
  if (verifyToken(token)) {
    return res.status(200).end();
  }
  return res.status(401).end();
});

// Créer un code (usage admin — protéger avec ADMIN_KEY en env)
app.post('/api/admin/create-code', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }

  const { label, email, max_uses, expires_at } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    await pool.query(
      `INSERT INTO demo_codes (code, label, email, max_uses, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [code, label || null, email || null, max_uses || 1, expires_at || null]
    );
    res.json({ ok: true, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Lister les codes (admin)
app.get('/api/admin/codes', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }
  try {
    const result = await pool.query(
      `SELECT id, code, label, email, max_uses, use_count, expires_at, created_at
       FROM demo_codes ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
