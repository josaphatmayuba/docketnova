const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors({ origin: ['http://docketnova.com', 'https://docketnova.com', 'http://www.docketnova.com', 'https://www.docketnova.com'] }));
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

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
