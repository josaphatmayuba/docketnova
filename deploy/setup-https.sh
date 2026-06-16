#!/bin/bash
# À exécuter UNE FOIS après que docketnova.com pointe vers ce serveur
set -e

DOMAIN="docketnova.com"
EMAIL="josaphatmayuba@gmail.com"
DEST="/opt/docketnova"

echo "=== Configuration HTTPS pour $DOMAIN ==="

# 1. Arrêter le container web pour libérer le port 80 temporairement
docker compose -f $DEST/docker-compose.yml stop web

# 2. Obtenir le certificat via certbot standalone
certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  -d $DOMAIN \
  -d www.$DOMAIN

# 3. Écrire la nouvelle config nginx avec HTTPS
cat > $DEST/web/nginx.conf << 'NGINX'
server {
    listen 80;
    server_name docketnova.com www.docketnova.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name docketnova.com www.docketnova.com;

    ssl_certificate     /etc/letsencrypt/live/docketnova.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docketnova.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;

    location /api/ {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|svg|png|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# 4. Mettre à jour docker-compose pour monter les certificats et exposer 443
cat > $DEST/docker-compose.yml << 'COMPOSE'
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: docketnova
      POSTGRES_USER: docketnova
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - internal

  api:
    build: ./api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://docketnova:${DB_PASSWORD}@db:5432/docketnova
      PORT: 3001
    depends_on:
      - db
    networks:
      - internal
      - web

  web:
    build: ./web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - api
    networks:
      - web

volumes:
  pgdata:

networks:
  internal:
  web:
COMPOSE

# 5. Rebuild et redémarrer
docker compose -f $DEST/docker-compose.yml up -d --build

# 6. Renouvellement automatique (cron)
(crontab -l 2>/dev/null; echo "0 3 * * * docker compose -f $DEST/docker-compose.yml stop web && certbot renew --quiet && docker compose -f $DEST/docker-compose.yml up -d web") | sort -u | crontab -

echo ""
echo "=== HTTPS configuré ==="
echo "https://docketnova.com est maintenant actif"
