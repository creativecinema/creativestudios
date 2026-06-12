# CreativeCinema – Web (Astro)

Zweisprachiges Frontend (DE Standard unter `/`, EN unter `/en/`) auf **Astro**.
Design-Quelle der Wahrheit ist `../site` (Vanilla HTML/CSS/JS); das Design-System
liegt als `public/styles/cc.css` + `public/scripts/cc.js`.

## Lokal starten
```bash
cd web
npm install        # einmalig
npm run dev        # http://localhost:4321
npm run build      # statischer Output nach dist/
npm run preview    # gebauten Output lokal ansehen
```

## Architektur
- `src/layouts/Base.astro` – `<head>`, Meta/hreflang, globale Chrome (Filmkorn, Letterbox-Intro, Scroll-Progress), lädt das Design-System.
- `src/components/Home.astro` – das gesamte Startseiten-Markup, **einmal**; gespeist über Props.
- `src/data/home.ts` – Inhalte getrennt nach Sprache (`de` / `en`). **Dies ist die Naht, die Storyblok ersetzt.**
- `src/pages/index.astro` (DE) · `src/pages/en/index.astro` (EN) – reichen nur die Sprache hinein.

## Storyblok (Phase 2 – läuft)
Space **„CreativeCinema - CreativeStudios"** (ID `293137314827916`, EU). Tokens in `.env`
(gitignored): `STORYBLOK_PAT` = Personal Access Token nur für CLI/Management,
`STORYBLOK_TOKEN` = Space-Preview-Token fürs Frontend.

- **Vollständiges Modell:** Komponente `home` (77 Felder, 13 Listen) + 11 Bausteine
  (`cc_chip`, `cc_proof`, `cc_scene`, `cc_path`, `cc_spec`, `cc_price`, `cc_usecase`, `cc_cmp`, `cc_case`, `cc_faq`, `cc_link`),
  gruppiert in Tabs (SEO, Hero, Proof, Showreel, Szenen, Zwei Wege, Studio, Virtual Production, In-Camera, Vergleich, Projekte, FAQ, Kontakt, Navigation).
  **Alles editierbar**, Textfelder übersetzbar. Anlegen/Aktualisieren via `npm run seed` (liest `src/data/home.ts`).
- **Zweisprachig:** alle Textfelder sind translatable; `npm run seed` schreibt DE **und** EN (EN als `__i18n__en`).
  `index.astro` zieht die Story `home` (DE), `en/index.astro` dieselbe Story mit `language: 'en'` (EN-Werte aufgelöst).
- Beide Seiten nutzen `src/lib/mergeHome.js`: legt den Storyblok-Inhalt über die Defaults aus `src/data/home.ts`
  – jedes gepflegte Feld/jede Liste überschreibt, fehlende bleiben Default → **Seite bricht nie**.
- **Editier-Workflow:** Inhalt in Storyblok ändern → `npm run build` (bzw. im Live-Betrieb Deploy-Webhook) → neu raus.
  Verifiziert per Marker-Roundtrip (CMS-Wert erscheint im statischen Output).
- **Visual Editor:** Vorschau-Domain steht auf `http://localhost:4321/`. Zum visuellen Bearbeiten lokal `npm run dev`
  starten; in Storyblok ggf. „http" für die Vorschau erlauben. Nach Deploy auf die Live-Domain umstellen.

**Noch offen (nächste Iterationen):**
- Unterseiten (LED-Studio, Virtual Production, Drehtag-Rechner) als eigene Storyblok-Komponenten/Stories (inkl. EN).
- Echte Studio-Fotos/Showreel in die `.media`-Slots.
- Phase 3: Deploy + Storyblok-Webhook (Publish → Auto-Rebuild).

## Phase 3 – Deploy
- Hosting **Cloudflare Pages** oder **Vercel** (statisch, globales CDN → keine 503-Probleme mehr).
- Build-Command `npm run build`, Output `dist/`.
- Domain `creative-cinema.de` per DNS umziehen; 301-Redirects der alten WP-URLs auf die neuen Routen.
