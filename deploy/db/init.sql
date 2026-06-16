CREATE TABLE IF NOT EXISTS demo_requests (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('entreprise', 'personnel', 'universite')),
  role VARCHAR(20) CHECK (role IN ('etudiant', 'professeur')),
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organisation VARCHAR(255),
  telephone VARCHAR(50),
  message TEXT,
  langue VARCHAR(5) DEFAULT 'fr',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_email ON demo_requests(email);

-- Codes d'accès pour la page /demo
CREATE TABLE IF NOT EXISTS demo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  label VARCHAR(255),               -- nom du destinataire (ex: "Jean Dupont")
  email VARCHAR(255),               -- courriel du destinataire
  max_uses INTEGER DEFAULT 1,       -- nombre d'utilisations autorisées
  use_count INTEGER DEFAULT 0,      -- nombre d'utilisations actuelles
  expires_at TIMESTAMPTZ,           -- null = jamais expiré
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_demo_codes_code ON demo_codes(code);
