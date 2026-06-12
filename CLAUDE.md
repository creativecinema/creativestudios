# CLAUDE.md – Projektkontext CreativeCinema GmbH

Dieses Repo überträgt eine vollständige Strategie- und Design-Session aus Claude.ai.
Sprache des Projekts: **Deutsch**. Alle Antworten, Texte und Commits auf Deutsch.

## Unternehmen
- CreativeCinema GmbH, Gundstraße 13a, 91056 Erlangen (HRB 16243, AG Fürth), GF Andreas Schulz
- Filmproduktion mit eigenem **XR-Studio: 50 m² LED-Wand mit Kameratracking** (Unreal-Workflow)
- ~4 Festangestellte, Ø-Umsatz ~500.000 €, Kundenlogos auf der Website: Siemens, KUKA, Daimler, Philips
- Claim: „DIREKT. INNOVATIV. PRODUKTIONSSICHER." · Tagline: „Zuhause im Kosmos der Medienwelt" (Raketen-Icon im Logo)
- Bestandsseite: WordPress + Astra + Elementor (creative-cinema.de); von außen zeitweise 503/Baukasten-Platzhalter – Hosting prüfen!

## Strategie (beschlossen)
Ziel: **700 k€ Umsatz, 30 % EBIT in 24 Monaten** (Jahr 1 realistisch 20–22 %). Drei Hebel:
1. **Studiovermietung** (Dry Hire ab 1.450 €/½ Tag, Studio+Operator ab 2.500 €/Tag – Preise sind Platzhalter, final bestätigen) → Ziel 45 Miettage ≈ 112,5 k€
2. **Content-Retainer** auf Basis „virtuelles Firmenset: einmal bauen, immer wieder drehen" → Ziel 4–6 Kunden à 2,5 k€/Monat
3. **Premium-Projektgeschäft** (Recruiting-Tag, Messefilm als Festpreispakete)
Positionierung: **„Das XR-Studio des Mittelstands"** – Lücke zwischen lokalen Imagefilm-Generalisten (Telefilm, Eight Miles High, filmkey) und High-End-Volumes (Hyperbowl/Penzing). Kein Kampf um „Filmproduktion Nürnberg".
Marketingbudget: ~24 k€/Jahr (Details: docs/CreativeCinema_Marketingplan_12M.xlsx).

## SEO (umzusetzen)
Seitenarchitektur: `/studio/led-studio-mieten/` · `/xr-studio/virtual-production/` · `/loesungen/recruiting-video/` · `/loesungen/messefilm/` · `/wissen/kosten-drehtag/` (Rechner) · `/wissen/`.
Fertige Texte, Meta-Tags, FAQ und Schema.org-Vorlagen: docs/SEO_Strategie_CreativeCinema.docx.

## CI-Tokens (am 11.06.2026 live von creative-cinema.de ausgelesen – verbindlich)
- **CI-Rot #C23336** (Logo-SVG `CC_Logo_White-1.svg`); Ableitung **#D9494C** für kleine Texte auf Dunkel (Kontrast)
- Flächen: Stage #101114 · Panel #17191E · Panel-2 #1D2026 · Linie #2A2D34 · Hell #F5F5F5
- Text: #F2EFE8 (auf Dunkel) · #9CA0A8 (sekundär) · #4A4A4A (auf Hell)
- Fonts: **Poppins 600** (Headlines) · **Source Sans 3/Pro** (Body; Versal-Labels mit +8–18 % Tracking)
- Buttons: Pille, Rot mit weißer Schrift · Radius Karten 14px
- Logo: https://creative-cinema.de/wp-content/uploads/2024/03/CC_Logo_White-1.svg
- Regeln & Komponenten: docs/Design_System.md (Pflichtlektüre vor UI-Arbeit)
- WICHTIG (Audit-Befund): Elementor-Global-Colors der Live-Seite stehen noch auf Defaults (#6EC1E4/#61CE70) – CI-Rot ist dort nicht tokenisiert.

## Dateien
- `site/index.html` – fertiger Redesign-Prototyp der Startseite (vanilla HTML/CSS/JS, CI-treu, WCAG-geprüft). Signatur-Element: Hero als LED-Wand mit klickbaren Kulissen-Chips. Deploybar als Sofort-Ersatz für die Platzhalterseite.
- `docs/Design_System.md` – Audit + Tokens + 7 Komponenten + Elementor-Migrationspfad
- `docs/SEO_Strategie_CreativeCinema.docx` – Keywords, Architektur, fertige Landingpage-Texte
- `docs/CreativeCinema_Marketingplan_12M.xlsx` – Monatsbudgets, Maßnahmenkalender, KPIs

## Backlog (nächste Schritte, priorisiert)
1. Unterseite `site/studio/led-studio-mieten/index.html` im selben Design bauen (Texte aus SEO-Docx Kap. 4)
2. Unterseite `site/xr-studio/virtual-production/index.html` (SEO-Docx Kap. 5)
3. Drehtag-Kostenrechner als interaktive Seite `site/wissen/kosten-drehtag/` (Leuchtturm-Asset)
4. Echte Studiofotos/Showreel in den Hero einsetzen (CSS-Kulissen ersetzen), Kundenlogo-SVGs einbinden
5. Sitemap.xml + robots.txt generieren; OG-Image erstellen
6. Optional: Elementor-Umsetzung gemäß Design_System.md Kap. 4

## Konventionen
- Nur Tokens aus Design_System.md verwenden, keine freien Hexwerte
- Ein roter Primär-CTA pro Viewport; kleine rote Texte auf Dunkel immer #D9494C
- Texte: aktiv, konkret, Zahlen statt Adjektive; CTAs benennen die Aktion
- Accessibility-Floor: 44px-Touchziele, sichtbarer Fokus, prefers-reduced-motion, Kontrast AA
- Keine Änderungen am Live-WordPress ohne ausdrückliche Freigabe
