# Script de transfert vers le serveur Lightsail
# Lancez depuis le dossier "lexibridge prototype"

$KEY = "$env:USERPROFILE\Downloads\LightsailDefaultKey-ca-central-1 (5).pem"
$SERVER = "admin@16.54.75.61"
$REMOTE = "/tmp/docketnova-deploy"

Write-Host "=== Preparation des fichiers ===" -ForegroundColor Cyan

# Créer le dossier web/html dans deploy et copier le HTML
$deployHtml = "deploy\web\html"
if (-not (Test-Path $deployHtml)) { New-Item -ItemType Directory -Force $deployHtml | Out-Null }
Copy-Item "Docket Nova - Accueil.html" "$deployHtml\index.html" -Force

# Copier le dossier brand
if (Test-Path "brand") {
    Copy-Item "brand" "$deployHtml\brand" -Recurse -Force
}

Write-Host "=== Transfert vers le serveur ===" -ForegroundColor Cyan

# Créer le dossier distant
ssh -i $KEY -o StrictHostKeyChecking=no $SERVER "rm -rf $REMOTE && mkdir -p $REMOTE"

# Transférer tout le dossier deploy
scp -i $KEY -o StrictHostKeyChecking=no -r "deploy\." "${SERVER}:${REMOTE}/"

Write-Host "=== Lancement du deploiement ===" -ForegroundColor Cyan

ssh -i $KEY -o StrictHostKeyChecking=no $SERVER @"
chmod +x $REMOTE/deploy.sh
cd $REMOTE
bash deploy.sh
"@

Write-Host "=== Termine ===" -ForegroundColor Green
Write-Host "Visitez http://16.54.75.61 pour verifier"
