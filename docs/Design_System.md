# Design-System CreativeCinema GmbH
Audit, Tokens und Komponenten-Dokumentation · Stand: 11.06.2026
Quellen: Live-Auslese creative-cinema.de (WordPress/Astra/Elementor, Logo-SVG `CC_Logo_White-1.svg`) und Redesign-Prototyp `CreativeCinema_Design_Redesign.html`.

---

## 1. Design-System-Audit (Ist-Zustand der Live-Seite)

### Zusammenfassung
**Geprüft:** Globale Farben, Typografie, Buttons, Abstände, Logo-Assets · **Befunde:** 6 · **Score: 38/100**

Das größte Problem vorweg: **Die Markenfarbe existiert im System nicht.** Das CI-Rot #C23336 lebt ausschließlich im Logo-SVG und in Bildern – in den globalen Farbeinstellungen von Elementor stehen noch die **Werksdefaults** (Primary #6EC1E4 Hellblau, Accent #61CE70 Grün, Text #7A7A7A). Jede neue Seite, die ein Redakteur mit Elementor-Globals baut, wird also automatisch markenfremd.

### Token-Abdeckung
| Kategorie | Definiert | Befund |
|---|---|---|
| Markenfarbe Rot | ❌ nirgends als Token | Nur im Logo-SVG (#C23336); Elementor-Globals = Defaults |
| Neutrale Flächen | ⚠️ teilweise (Astra) | #000/#1a1a1a/#4a4a4a/#f5f5f5/#fff vorhanden, aber unbenannt (astglobalcolor0–8) |
| Typografie | ⚠️ implizit | Poppins 600 (Headlines) + Source Sans Pro (Body) konsistent genutzt, aber nicht als benannte Styles gepflegt |
| Abstände | ❌ | Sektionen mit individuellen Elementor-Paddings, keine Skala |
| Radius | ⚠️ | Buttons 24px, sonst uneinheitlich |
| Schatten/Motion | ❌ | nicht definiert |

### Komponenten-Vollständigkeit (Live-Seite)
| Komponente | Zustände | Varianten | Doku | Score |
|---|---|---|---|---|
| Button | ⚠️ nur Default/Hover | ❌ eine Variante | ❌ | 3/10 |
| Zähler (9+ Clients / 45 Productions) | ✅ | – | ❌ | 6/10 |
| Hero (Video + Logo + Linie) | ✅ | ❌ | ❌ | 5/10 |
| Navigation | ⚠️ kein sichtbarer Fokus | ❌ | ❌ | 4/10 |
| Formular (WPForms) | ⚠️ Fehlerfarbe #990000 hartkodiert | – | ❌ | 4/10 |

### Prioritäre Maßnahmen
1. **Elementor Global Colors auf die CI-Tokens umstellen** (Kapitel 2) – verhindert markenfremde neue Seiten und ist in 15 Minuten erledigt.
2. **Globale Schrift-Styles anlegen** (Poppins/Source Sans 3 mit fester Skala) statt Schriftgrößen pro Widget.
3. **Komponenten aus dem Redesign-Prototyp als dokumentierte Patterns übernehmen** (Kapitel 3) – der Prototyp ist bereits vollständig tokenisiert.

---

## 2. Design-Tokens (Soll-System)

### 2.1 Farben
| Token | Wert | Verwendung |
|---|---|---|
| `--ci-rot` | **#C23336** | Markenfarbe (aus Logo-SVG). Primäre Buttons, Akzentlinien, große Zahlen, Logo-Akzent |
| `--ci-rot-hell` | #D9494C | Abgeleitete Aufhellung: kleine rote Texte/Labels auf dunklem Grund (Kontrast ≥ 4,5:1) |
| `--stage` | #101114 | Dunkler Seitenhintergrund (Studio-Schwarz) |
| `--panel` | #17191E | Dunkle Sektionen/Karten |
| `--panel-2` | #1D2026 | Karten auf Panel (zweite Ebene) |
| `--line` | #2A2D34 | Linien, Rahmen, Tabellen-Trenner |
| `--bone` | #F2EFE8 | Primärtext auf Dunkel (warmes Weiß) |
| `--muted` | #9CA0A8 | Sekundärtext auf Dunkel |
| `--hell` | #F5F5F5 | Heller Flächen-Hintergrund (Bestand Astra) |
| `--text-hell` | #4A4A4A | Fließtext auf hellen Flächen (Bestand) |

Regeln: #C23336 nie als Fließtextfarbe auf Dunkel (Kontrast nur ~3,2:1) – dafür immer `--ci-rot-hell`. Auf Weiß ist #C23336 als Textfarbe zulässig (4,6:1). Pro Ansicht maximal eine rote Aktionsfläche im Viewport.

### 2.2 Typografie
| Rolle | Schrift | Gewicht | Größe (Desktop) | Tracking |
|---|---|---|---|---|
| Display/H1 | Poppins | 600–700 | clamp(2,3–4,3rem) | −1 % |
| H2 | Poppins | 600 | 1,9–2,7rem | −1 % |
| H3/Kartentitel | Poppins | 600 | 1,05–1,55rem | 0 |
| Fließtext | Source Sans 3 | 400 | 17px / LH 1,6 | 0 |
| Label/Eyebrow/Technik | Source Sans 3 | 600 | 12–13px, VERSALIEN | +8 bis +18 % |
| Zahlen (Proof) | Poppins | 700 | 2,6rem | 0 |

Die Versal-Labels mit weitem Tracking sind das typografische Erkennungszeichen (übernommen aus dem Bestands-Look der letterspaced Textblöcke).

### 2.3 Abstände, Radius, Schatten, Motion
| Token | Wert |
|---|---|
| Abstands-Skala | 4 / 8 / 12 / 16 / 24 / 36 / 56 / 96 px (Sektionen: 96) |
| Radius Karten | 14px (`--radius`) |
| Radius Buttons/Chips | 999px (Pille; Bestand: 24px → vereinheitlicht auf Pille) |
| Schatten Karte | keiner (Flächen über Farbe getrennt) |
| Schatten CTA-Hover | 0 8px 28px rgba(194,51,54,.40) |
| Motion | 150–250ms ease; Kulissen-Blende 800ms; `prefers-reduced-motion` deaktiviert alles |

### 2.4 Logo & Assets
| Asset | Datei | Einsatz |
|---|---|---|
| Wortmarke weiß | `/wp-content/uploads/2024/03/CC_Logo_White-1.svg` | Dunkle Hintergründe, Navigation |
| Raketen-Icon | `/wp-content/uploads/2023/01/CC_Logo_Rocket.svg` | Favicon, Akzent, Social-Avatare |
| Kundenlogos | `/wp-content/uploads/2024/03/` (siemens, kuka, daimler, philips) | Referenzleiste |
| Schutzraum Logo | Höhe des Buchstabens „C" umlaufend; min. Darstellungshöhe 28px | |

---

## 3. Komponenten-Dokumentation

### 3.1 Button
**Beschreibung:** Primäre Handlung pro Sektion. Maximal ein roter Button im Viewport.

| Variante | Einsatz |
|---|---|
| Primär (`btn-amber`*) | Conversion-Aktionen: „Verfügbarkeit anfragen", „Produktion beauftragen" |
| Ghost (`btn-ghost`) | Sekundär: „Studio besichtigen", „Rechner ansehen" |

\* Klassenname historisch, rendert CI-Rot – bei Elementor-Umsetzung in `btn-primary` umbenennen.

| Zustand | Visuell |
|---|---|
| Default | Rot #C23336, weiße Schrift, Pille, 13px/26px Padding |
| Hover | translateY(−1px) + roter Schatten |
| Fokus | 2px Outline `--ci-rot-hell`, 3px Offset |
| Disabled | 40 % Opazität, kein Pointer |

Accessibility: echtes `<a>`/`<button>`, Mindesthöhe 44px, Beschriftung = Aktion („Verfügbarkeit anfragen", nie „Mehr").

### 3.2 Kulissen-Chip (Signatur-Komponente)
**Beschreibung:** Schalter im Hero, der die LED-Wand-Kulisse wechselt – demonstriert das Produktversprechen.
| Zustand | Visuell / Verhalten |
|---|---|
| Default | Versal-Label, Rahmen `--line`, Text `--muted`, min-height 44px |
| Hover | Rahmen/Text aufgehellt |
| Aktiv | Rahmen + Text `--ci-rot-hell`, innerer Glow, `aria-pressed="true"` |
**Don't:** Mehr als 5 Chips; Chips ohne sichtbare Wirkung auf die Bühne.

### 3.3 Pfad-Karte (Zwei-Wege-Weiche)
Karten „Produktion beauftragen" / „Studio mieten". Eyebrow (Zielgruppe) → H3 → Beschreibung → Link mit Pfeil. Hover: Rahmen `--ci-rot`, −3px Lift. Gesamte Karte ist ein Link (ein Tab-Stopp).

### 3.4 Preis-Karte
Name + Kurzbeschreibung links, Preis rechts in `--ci-rot-hell` (Versal-Stil). Variante `featured` mit rotem Rahmen für das meistgebuchte Modell – nur eine pro Gruppe.

### 3.5 Proof-Band / Zähler
Fortführung des Bestands-Patterns („9+ Clients / 45 Productions"): Zahl in Poppins 700 Rot, Erklärung in `--muted`. Regel: Zahlen müssen belegbar sein und jährlich gepflegt werden.

### 3.6 FAQ-Accordion
Natives `<details>/<summary>` (tastatur- und screenreader-fähig ohne JS). Plus-Symbol rotiert bei geöffnetem Zustand. Antworten max. 72 Zeichen Zeilenlänge.

### 3.7 Spezifikations-Tabelle
Zweispaltig: Label in Versal-Stil `--muted`, Wert in Fließtext. Für Technik-Daten des Studios; Inhalte aus einer Quelle pflegen (keine abweichenden Specs auf Unterseiten).

---

## 4. Umsetzung in WordPress/Elementor (Migrationspfad)

1. **Site Settings → Global Colors:** Primary = #C23336, Secondary = #1A1A1A, Text = #4A4A4A, Accent = #D9494C. Astra-Palette (astglobalcolor0–8) auf die Token-Werte aus 2.1 mappen.
2. **Global Fonts:** Primary = Poppins 600, Secondary = Poppins 600, Text = Source Sans 3 400, Accent = Source Sans 3 600 Versalien +8 % Tracking. (OMGF hostet die Fonts bereits lokal – Source Sans 3 ergänzen.)
3. **Buttons:** Globalen Button-Style auf Pille/Rot/Weiß stellen; WPForms-Fehlerrot #990000 durch #C23336 ersetzen.
4. **Neue Sektionen nur noch mit Globals bauen** – keine Widget-individuellen Hexwerte (Audit-Befund Nr. 1).
5. Prototyp-Komponenten (Hero-Wand, Pfad-Karten, Preis-Karten, FAQ) als Elementor-Templates anlegen und im Template-Verzeichnis benennen wie hier dokumentiert.

---

## 5. Do's & Don'ts (Kurzreferenz fürs Team)

| ✅ Do | ❌ Don't |
|---|---|
| Rot nur für Aktion, Akzent, Zahlen | Rote Fließtexte oder ganze rote Flächen |
| Versal-Labels für Technik/Meta | Versalien für Fließtext |
| Ein primärer CTA pro Viewport | Drei rote Buttons nebeneinander |
| Studio-Schwarz #101114 als Bühnenfarbe | Reines #000 großflächig |
| Tokens aus diesem Dokument | Hexwerte frei im Widget eintippen |
| Zahlen mit Beleg (45+ Produktionen) | Superlative ohne Beweis |
