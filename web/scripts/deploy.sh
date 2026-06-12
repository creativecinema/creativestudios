#!/usr/bin/env bash
# Lokaler Deploy nach one.com (SFTP). Voraussetzung: lftp  (macOS: brew install lftp)
# Zugangsdaten via Umgebungsvariablen ODER web/.env.deploy (gitignored, NICHT committen).
set -euo pipefail
cd "$(dirname "$0")/.."

# .env.deploy laden, falls vorhanden
if [ -f .env.deploy ]; then set -a; . ./.env.deploy; set +a; fi
: "${ONECOM_SFTP_HOST:?Bitte ONECOM_SFTP_HOST setzen (z. B. ssh.creative-studios.tv)}"
: "${ONECOM_SFTP_USER:?Bitte ONECOM_SFTP_USER setzen}"
: "${ONECOM_SFTP_PASSWORD:?Bitte ONECOM_SFTP_PASSWORD setzen}"
: "${ONECOM_REMOTE_PATH:?Bitte ONECOM_REMOTE_PATH setzen (Webroot, z. B. / oder /public_html)}"

echo "→ Build (Astro, statisch)…"
npm run build

echo "→ Upload nach ${ONECOM_SFTP_HOST}:${ONECOM_REMOTE_PATH} …"
# mirror -R = lokal→remote, --delete entfernt veraltete Dateien (sauberer Stand).
# ⚠️ Erst-Deploy am besten auf einen Test-Unterordner richten und prüfen!
lftp -c "
  set sftp:auto-confirm yes;
  set net:max-retries 2; set net:timeout 20;
  open -u '${ONECOM_SFTP_USER}','${ONECOM_SFTP_PASSWORD}' sftp://${ONECOM_SFTP_HOST};
  mirror -R --delete --parallel=4 --verbose ./dist '${ONECOM_REMOTE_PATH}';
"
echo "✓ Deploy fertig: https://creative-studios.tv/"
