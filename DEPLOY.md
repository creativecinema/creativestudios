# Deployment → one.com

CreativeCinema läuft als **statische Astro-Seite** (`web/dist/` = reines HTML/CSS/JS).
one.com ist klassisches Webhosting (Apache) – ideal für statische Dateien, **kann aber nicht selbst bauen**.
Ablauf: **bauen (lokal oder per GitHub Actions) → `dist/` per SFTP zu one.com hochladen.**

> Inhalte ändern: in Storyblok bearbeiten → **Publish** → danach **neu bauen + hochladen** (manuell oder per Webhook, s. u.).
> Der Build zieht nur **publizierte** Storyblok-Inhalte.

---

## Was du aus deinem one.com-Konto brauchst
Im one.com Control Panel unter **„SFTP/SSH"**:
- **Host** (z. B. `ssh.creative-studios.tv` oder ein von one.com genannter Server)
- **Benutzername** und **Passwort** (SFTP)
- **Webroot-Pfad** – wohin die Domain zeigt (oft `/`, `/public_html` oder `/www`)
- SSL: one.com stellt **kostenloses Let's-Encrypt-Zertifikat** bereit → in der Domain-Verwaltung aktivieren.

---

## Variante A – Lokal deployen (am einfachsten)
1. `brew install lftp` (einmalig).
2. `cd web && cp .env.deploy.example .env.deploy` und die SFTP-Daten eintragen (`.env.deploy` ist gitignored).
3. `npm run deploy` → baut und lädt `dist/` per SFTP hoch.

## Variante B – Automatisch per GitHub Actions
Workflow liegt unter `.github/workflows/deploy.yml`. Auslöser: Push auf `main`, manueller Start, oder Storyblok-Webhook.

**GitHub → Repo → Settings → Secrets and variables → Actions** anlegen:
| Secret | Wert |
|---|---|
| `STORYBLOK_TOKEN` | Space-**Preview**-Token (lesend) – derselbe wie in `web/.env` |
| `ONECOM_SFTP_HOST` | z. B. `ssh.creative-studios.tv` |
| `ONECOM_SFTP_USER` | SFTP-Benutzer |
| `ONECOM_SFTP_PASSWORD` | SFTP-Passwort |
| `ONECOM_REMOTE_PATH` | Webroot, z. B. `/` |

Dann: Code zu GitHub pushen → Actions baut & deployt. Manuell: **Actions → „Build & Deploy → one.com" → Run workflow**.

### Storyblok „Publish" → Auto-Deploy
Storyblok (Space → **Settings → Webhooks**) → „Story published" auf GitHub zeigen lassen:
- URL: `https://api.github.com/repos/<owner>/<repo>/dispatches`
- Custom Header: `Authorization: Bearer <GitHub-PAT mit repo-Scope>` und `Accept: application/vnd.github+json`
- Body: `{ "event_type": "storyblok-publish" }`

Falls dein Storyblok-Plan keine Custom-Header erlaubt: kleinen Relay (Cloudflare Worker / Pipedream) dazwischenschalten, oder einfach **manuell deployen** bzw. per `workflow_dispatch`-Knopf.

---

## Domain / DNS-Umstellung (Achtung: Live-WordPress läuft noch)
1. **Zuerst testen:** `ONECOM_REMOTE_PATH` auf einen Unterordner (z. B. `/preview`) richten und `https://creative-studios.tv/preview/` prüfen – ODER eine Test-Subdomain in one.com anlegen.
2. Passt alles, Webroot auf den echten Pfad stellen und deployen (überschreibt die alte WordPress-Seite – vorher sichern!).
3. **301-Redirects** alter WordPress-URLs auf die neuen Routen ggf. in `web/public/.htaccess` ergänzen.
4. In **Storyblok → Settings → Visual Editor** die Vorschau-Domain von `localhost` auf `https://creative-studios.tv/` umstellen.
5. **Google Search Console:** neue `https://creative-studios.tv/sitemap-index.xml` einreichen.

---

## Enthalten & vorbereitet
- `web/public/.htaccess`: HTTPS-Zwang, www→non-www, Caching, Gzip, `ErrorDocument 404`.
- `web/src/pages/404.astro`: gebrandete Fehlerseite.
- Saubere Verzeichnis-URLs (`/studio/led-studio-mieten/` → `index.html`) – von Apache nativ unterstützt.
- `sitemap-index.xml`, `robots.txt`, OG-Bild (`og-cover.svg`; für Social besser durch 1200×630-PNG ersetzen).
