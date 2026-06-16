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
