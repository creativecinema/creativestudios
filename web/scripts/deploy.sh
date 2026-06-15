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
: "${ONECOM_REMOTE_PATH:=.}"   # Webroot = SFTP-Login-Verzeichnis bei creative-studios.tv

echo "→ Build (Astro, statisch)…"
npm run build

echo "→ Upload nach ${ONECOM_SFTP_HOST} (Pfad: ${ONECOM_REMOTE_PATH}) …"
# User + Passwort URL-encodieren -> robust gegen Sonderzeichen im Passwort
ENC_USER=$(printf '%s' "$ONECOM_SFTP_USER" | python3 -c "import sys,urllib.parse;print(urllib.parse.quote(sys.stdin.read(),safe=''))")
ENC_PASS=$(printf '%s' "$ONECOM_SFTP_PASSWORD" | python3 -c "import sys,urllib.parse;print(urllib.parse.quote(sys.stdin.read(),safe=''))")
# mirror -R = lokal→remote (ohne --delete: lässt Altdateien stehen, sicher)
lftp -c "
  set sftp:auto-confirm yes;
  set net:max-retries 2; set net:timeout 20;
  open sftp://${ENC_USER}:${ENC_PASS}@${ONECOM_SFTP_HOST};
  mirror -R --no-perms --parallel=4 ./dist '${ONECOM_REMOTE_PATH}';
" 2>&1 | sed -E "s#${ENC_PASS}#***#g; s#(sftp://[^@]*@)#sftp://***@#g"
echo "✓ Deploy fertig: https://creative-studios.tv/"
