#!/bin/bash
set -e

echo "=== Docket Nova — Déploiement ==="

# 1. Installer Docker si absent
if ! command -v docker &>/dev/null; then
  echo "Installation de Docker..."
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $USER
  echo "Docker installé. Reconnectez-vous si besoin."
fi

# 2. Installer Docker Compose plugin si absent
if ! docker compose version &>/dev/null; then
  apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

# 3. Copier le HTML dans le dossier web/html
mkdir -p /opt/docketnova/web/html
mkdir -p /opt/docketnova/web/html/brand
mkdir -p /opt/docketnova/api
mkdir -p /opt/docketnova/db

# Copier les fichiers (lancé depuis le dossier deploy/ uploadé)
cp -r web/html/ /opt/docketnova/web/
cp web/nginx.conf /opt/docketnova/web/nginx.conf
cp web/Dockerfile /opt/docketnova/web/Dockerfile
cp api/index.js /opt/docketnova/api/
cp api/package.json /opt/docketnova/api/
cp api/Dockerfile /opt/docketnova/api/
cp db/init.sql /opt/docketnova/db/
cp docker-compose.yml /opt/docketnova/

cd /opt/docketnova

# 4. Créer .env si absent
if [ ! -f .env ]; then
  echo "DB_PASSWORD=$(openssl rand -hex 24)" > .env
  echo "Mot de passe BD généré dans /opt/docketnova/.env"
fi

# 5. Lancer
docker compose -p deploy pull 2>/dev/null || true
docker compose -p deploy up -d --build

echo ""
echo "=== Déploiement terminé ==="
echo "Site disponible sur http://16.54.75.61"
echo "Vérifiez les logs : docker compose logs -f"
