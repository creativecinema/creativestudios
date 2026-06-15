// Inhalt der Startseite, getrennt nach Sprache.
// Dies ist die "Content-Naht": In Phase 2 liefert genau diese Struktur Storyblok
// (Visual Editor) – die Komponente Home.astro bleibt unverändert.

export interface HomeContent {
  meta: { title: string; description: string };
  nav: { links: { label: string; href: string }[]; cta: string };
  skip: string;
  hero: {
    stage: string; claim: string; kicker: string;
    h1: string; h1hl: string; h1rest: string;
    sub: string; ctaPrimary: string; ctaPrimaryHref: string; ctaGhost: string; ctaGhostHref: string;
    chipsLabel: string; chips: { target: string; label: string }[]; scrollHint: string; showreel: string;
  };
  proof: { num: number; suf?: string; text: string }[];
  showreel: { eyebrow: string; h2: string; lede: string; caption: string; play: string };
  scenesKicker: string;
  scenes: { num: string; name: string; desc: string; bd: string }[];
  scenesRail: string[];
  twoWays: { eyebrow: string; h2: string; cards: { eyebrow: string; title: string; desc: string; link: string; href: string }[] };
  studio: {
    eyebrow: string; h2: string; lede: string;
    specs: [string, string][];
    prices: { name: string; desc: string; tag: string; featured?: boolean }[];
    cta: string; ctaHref: string;
  };
  vp: {
    eyebrow: string; h2: string; lede: string;
    uses: { tag: string; title: string; desc: string }[];
    callout: { kicker: string; title: string; text: string };
  };
  incamera: { eyebrow: string; h2: string; lede: string; before: string; after: string };
  compare: {
    eyebrow: string; h2: string;
    left: { title: string; tagline: string; items: [string, string][] };
    right: { title: string; tagline: string; items: [string, string][] };
    cta?: string; ctaHref?: string;
  };
  projects: { eyebrow: string; h2: string; lede: string; logos: string[]; cases: { client: string; metric: string }[] };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  contact: { eyebrow: string; h2: string; lede: string; ctaPrimary: string; ctaGhost: string; nap: string[]; claim: string };
  footer: { copy: string; links: { label: string; href: string }[] };
}

export const home: Record<'de' | 'en', HomeContent> = {
  de: {
    meta: {
      title: 'Filmproduktion & XR-Studio Erlangen/Nürnberg | CreativeCinema',
      description: 'Filmproduktion mit eigener 50-m²-LED-Wand: Virtual Production, Studiovermietung & Content-Abos für den Mittelstand. Erlangen, 20 Min. von Nürnberg.',
    },
    nav: {
      links: [
        { label: 'Studio mieten', href: '#studio' },
        { label: 'Virtual Production', href: '#produktion' },
        { label: 'Drehtag-Rechner', href: '#vergleich' },
        { label: 'Projekte', href: '#projekte' },
      ],
      cta: 'Verfügbarkeit anfragen',
    },
    skip: 'Zum Inhalt springen',
    hero: {
      stage: 'XR-STAGE 01 · ERLANGEN', claim: 'DIREKT. INNOVATIV. PRODUKTIONSSICHER.',
      kicker: 'Filmproduktion · XR-Studio · Erlangen',
      h1: 'Hollywood-Technologie, ', h1hl: 'eine Stunde', h1rest: ' von Ihrem Werkstor entfernt.',
      sub: 'CreativeCinema ist Filmproduktion und XR-Studio in einem: 50 m² LED-Wand mit Kameratracking in Erlangen – für Produktionen, die früher fünf Locations gebraucht hätten. Und für alle, die das Studio einfach mieten wollen.',
      ctaPrimary: 'Produktion beauftragen', ctaPrimaryHref: '#produktion', ctaGhost: 'Studio mieten', ctaGhostHref: '#studio',
      chipsLabel: 'Kulisse wechseln – so schnell geht es auch am Drehtag',
      chips: [
        { target: 'desert', label: 'Wüste · Marokko' },
        { target: 'skyline', label: 'Skyline · Nacht' },
        { target: 'halle', label: 'Werkshalle' },
        { target: 'alpen', label: 'Alpenpanorama' },
      ],
      scrollHint: 'Scrollen', showreel: 'Showreel ansehen',
    },
    proof: [
      { num: 5, text: 'Locations an einem einzigen Drehtag – Kulissenwechsel in Minuten statt Umzugstagen.' },
      { num: 50, suf: 'm²', text: 'LED-Wand mit Kameratracking und Unreal-Engine-Workflow – das Set ist immer da, wo Sie sind.' },
      { num: 45, suf: '+', text: 'Produktionen für Kunden von Siemens bis KUKA – Ihr virtuelles Firmenset dreht unbegrenzt weiter.' },
    ],
    showreel: { eyebrow: 'Showreel', h2: 'Sehen schlägt erklären.', lede: 'Ein Blick auf die LED-Wand sagt mehr als jede Spezifikation – hier kommt euer Showreel.', caption: 'CreativeCinema · Showreel 2026', play: 'Showreel abspielen' },
    scenesKicker: 'Fünf Locations · ein Drehtag',
    scenes: [
      { num: '01', name: 'Wüste · Marokko', desc: 'Vormittags der Produktfilm in der Wüste – ohne Flugkosten, ohne Genehmigung, ohne Sandsturm-Risiko.', bd: 'bd-desert' },
      { num: '02', name: 'Skyline · Nacht', desc: 'Mittags die Keynote vor der nächtlichen Skyline – broadcast-fähige Kulisse statt Bürorückwand.', bd: 'bd-skyline' },
      { num: '03', name: 'Werkshalle', desc: 'Nachmittags das Recruiting-Video in der Werkshalle – ohne Dreh im laufenden Betrieb.', bd: 'bd-halle' },
      { num: '04', name: 'Alpenpanorama', desc: 'Zum Feierabend der Imagespot vor den Alpen. Vier Welten, ein Studio, ein einziger Tag.', bd: 'bd-alpen' },
    ],
    scenesRail: ['Wüste', 'Skyline', 'Werkshalle', 'Alpen'],
    twoWays: {
      eyebrow: 'Was suchen Sie?', h2: 'Zwei Wege ins Studio.',
      cards: [
        { eyebrow: 'Für Unternehmen', title: 'Produktion beauftragen', desc: 'Imagefilm, Recruiting-Video, Messefilm, Livestream oder monatlicher Content im Abo – konzipiert, gedreht und geschnitten von einem Team, unter einem Dach.', link: 'Zu den Produktionen', href: '#produktion' },
        { eyebrow: 'Für Agenturen, Fotografen & Produktionen', title: 'Studio mieten', desc: 'Die LED-Stage als Ihr Set: buchbar ab halben Tagen, Dry Hire oder mit unserem Operator. Eigene Unreal-Umgebungen mitbringen oder aus der Set-Bibliothek wählen.', link: 'Zur Studiovermietung', href: '#studio' },
      ],
    },
    studio: {
      eyebrow: 'Studiovermietung', h2: 'LED-Studio mieten in Erlangen – ab halben Tagen.',
      lede: 'Nordbayerns Virtual-Production-Stage für Film, Foto und Livestream. Sie drehen vor jeder Kulisse der Welt, ohne das Studio zu verlassen – mit Parkplätzen direkt vor der Tür und ebenerdiger Anlieferung.',
      specs: [
        ['LED-Fläche', '50 m² hochauflösende LED-Wand'],
        ['Tracking', 'Kameratracking für perspektivisch korrekte Hintergründe (In-Camera VFX)'],
        ['Engine', 'Unreal-Engine-Workflow, Echtzeit-Umgebungen, eigene Inhalte als Datei anlieferbar'],
        ['Licht & Ton', 'Professionelles Licht-Setup, Tontechnik, Maske, Aufenthaltsbereich'],
        ['Alternativ', 'Greenscreen-Setup auf Wunsch verfügbar'],
        ['Standort', 'Gundstraße 13a, 91056 Erlangen · 20 Min. von Nürnberg'],
      ],
      prices: [
        { name: 'Dry Hire', desc: 'Studio + LED-Technik, Ihr Team produziert selbst.', tag: 'ab 1.450 € / ½ Tag' },
        { name: 'Studio + Operator', desc: 'Unser LED-/Tracking-Operator unterstützt Ihre Crew.', tag: 'ab 2.500 € / Tag', featured: true },
        { name: 'Full Service', desc: 'Crew, Licht, Kamera und Regieunterstützung – Angebot in 24 h.', tag: 'auf Anfrage' },
      ],
      cta: 'Verfügbarkeit anfragen', ctaHref: '#kontakt',
    },
    vp: {
      eyebrow: 'Virtual Production', h2: 'Ihr Film aus dem XR-Studio – 5 Locations an einem Drehtag.',
      lede: 'Produktfilm in der Wüste, Recruiting-Video auf dem Werksdach, Keynote vor der Skyline – an einem einzigen Drehtag, in Erlangen. Konzept, Dreh, LED-Stage und Postproduktion unter einem Dach.',
      uses: [
        { tag: 'Marke', title: 'Image- & Produktfilme', desc: 'Markenwelten, die es physisch nicht gibt – fotorealistisch und in Echtzeit am Set sichtbar.' },
        { tag: 'HR', title: 'Recruiting-Videos', desc: 'Ein Drehtag, fünf Kulissen, fertige Clips für Karriereseite und Social – zum Festpreis.' },
        { tag: 'Messe', title: 'Messefilme', desc: 'SPS, embedded world & Co.: Ihr Auftritt wird größer, als die Halle erlaubt – ohne Dreh im Betrieb.' },
        { tag: 'Live', title: 'Livestreams & Events', desc: 'Townhalls und Keynotes mit broadcast-fähiger Kulisse statt Bürorückwand.' },
        { tag: 'Abo', title: 'Content-Abos', desc: 'Monatliche Reels und Serienformate aus Ihrem festen virtuellen Set – planbar und wiedererkennbar.' },
        { tag: 'Daten', title: 'CAD wird Kulisse', desc: 'Ihre Produkt- und Anlagendaten (CAD, BIM, 3D) werden zur begehbaren Filmkulisse.' },
      ],
      callout: { kicker: 'Der Effizienzhebel', title: 'Einmal bauen, immer wieder drehen: Ihr virtuelles Firmenset.', text: 'Wir digitalisieren Ihre Markenwelt – Showroom, Werkshalle oder abstrakte Brand-Umgebung – einmal als Unreal-Engine-Set. Jede weitere Produktion startet ab Minute 1 im fertigen Set: planbar, wiedererkennbar, zu einem Bruchteil der üblichen Produktionszeit. Das ist die Grundlage unserer Content-Abos.' },
    },
    incamera: {
      eyebrow: 'In-Camera statt Greenscreen', h2: 'Greenscreen war gestern.',
      lede: 'Auf der LED-Wand steht die fertige Welt schon am Set – echte Reflexionen, echtes Licht, keine bösen Überraschungen in der Post. Ziehen Sie den Regler.',
      before: 'Greenscreen', after: 'In-Camera · LED',
    },
    compare: {
      eyebrow: 'Ehrlich gerechnet', h2: 'Was kostet ein Drehtag wirklich?',
      left: { title: 'Klassischer Locationdreh', tagline: 'Reisen, Genehmigungen, Wetter – kalkuliert vor jedem Projekt neu.', items: [['Locationmiete & Genehmigungen', 'ab 1.500 €'], ['Reise & Übernachtung Crew', 'ab 1.200 €'], ['Umbau-/Fahrtzeit zwischen Motiven', '2–4 h/Tag'], ['Wetterrisiko / Ersatztermin', 'unkalkulierbar'], ['Locations pro Drehtag', '1–2']] },
      right: { title: 'Virtual Production bei CreativeCinema', tagline: 'Ein Studio, jede Kulisse, planbares Budget.', items: [['Locationmiete & Genehmigungen', '0 €'], ['Reise & Übernachtung', '0 €'], ['Kulissenwechsel', 'Minuten'], ['Wetterrisiko', 'keins'], ['Locations pro Drehtag', '5+']] },
      cta: 'Zum interaktiven Drehtag-Rechner', ctaHref: '#vergleich',
    },
    projects: { eyebrow: 'Projekte', h2: 'Referenzen mit Zahlen statt Adjektiven.', lede: '45+ Produktionen u. a. für Siemens, KUKA, Daimler und Philips – jede Case Study nennt künftig eingesparte Drehtage, Locations und Budgets.', logos: ['SIEMENS', 'KUKA', 'DAIMLER', 'PHILIPS', '+ Ihre Marke'], cases: [{ client: 'Siemens Healthineers', metric: '3 Locations → 1 Drehtag' }, { client: 'KUKA', metric: 'Recruiting-Reihe aus dem Firmenset' }, { client: 'Philips', metric: 'Produktfilm ohne eine Reise' }] },
    faq: {
      eyebrow: 'Häufige Fragen', h2: 'Bevor Sie anfragen.',
      items: [
        { q: 'Kann ich das Studio ohne Virtual-Production-Erfahrung mieten?', a: 'Ja. Im Modell „Studio + Operator" bedient unser Team LED-Wand, Tracking und Unreal Engine – Ihr Team konzentriert sich auf Kamera und Inhalt.' },
        { q: 'Was kostet eine Virtual-Production-Produktion?', a: 'Einstiegsprojekte wie der Recruiting-Tag beginnen im niedrigen fünfstelligen Bereich – durch eingesparte Locations, Reisen und Drehtage liegt das Gesamtbudget häufig unter dem eines klassischen Drehs.' },
        { q: 'Sieht man, dass es nicht echt ist?', a: 'Bei korrektem Tracking und Licht: nein. Die Umgebung reagiert perspektivisch korrekt auf jede Kamerabewegung – im Gegensatz zum Greenscreen sehen Sie das fertige Bild bereits am Set.' },
        { q: 'Wie kurzfristig kann ich buchen?', a: 'Je nach Auslastung sind Buchungen innerhalb von fünf Werktagen möglich. Verfügbarkeit erfragen Sie am schnellsten über das Anfrageformular – Antwort innerhalb von 24 Stunden.' },
        { q: 'Können wir unsere CAD-/3D-Daten verwenden?', a: 'Ja. Produkt- und Anlagendaten (CAD, BIM, 3D-Modelle) bereiten wir für die Unreal Engine auf und machen sie zur begehbaren Filmkulisse.' },
      ],
    },
    contact: {
      eyebrow: 'Kontakt', h2: 'Drehtermin sichern – Antwort in 24 Stunden.',
      lede: 'Schicken Sie uns Wunschtermin und Vorhaben. Im kostenlosen Tech-Briefing (15 Min.) klären wir Umgebungen, Kamera und Workflow.',
      ctaPrimary: 'Verfügbarkeit anfragen', ctaGhost: 'Open-Studio-Termine',
      nap: ['Gundstraße 13a · 91056 Erlangen', '20 Min. von Nürnberg · Parkplätze am Studio', 'as@creative-cinema.net'],
      claim: 'Direkt. Innovativ. Produktionssicher.',
    },
    footer: { copy: '© 2026 CreativeCinema GmbH, Erlangen · Zuhause im Kosmos der Medienwelt.', links: [{ label: 'English', href: '/en/' }, { label: 'Impressum', href: '/impressum/' }, { label: 'Datenschutz', href: '/datenschutz/' }] },
  },

  en: {
    meta: {
      title: 'Video & Virtual Production Studio in Germany | CreativeCinema',
      description: 'English-speaking video production company with its own 50 m² LED volume near Nuremberg, Germany. Virtual production, studio rental & content retainers — five locations in a single shoot day.',
    },
    nav: {
      links: [
        { label: 'Studio rental', href: '#studio' },
        { label: 'Virtual Production', href: '#produktion' },
        { label: 'Cost comparison', href: '#vergleich' },
        { label: 'Work', href: '#projekte' },
      ],
      cta: 'Check availability',
    },
    skip: 'Skip to content',
    hero: {
      stage: 'XR-STAGE 01 · GERMANY', claim: 'DIRECT. INNOVATIVE. PRODUCTION-PROOF.',
      kicker: 'Video & Virtual Production · Germany',
      h1: 'Hollywood technology, ', h1hl: 'one hour', h1rest: ' from your factory gate.',
      sub: 'CreativeCinema is a video production company and XR studio in one: a 50 m² LED volume with camera tracking near Nuremberg, Germany. An English-speaking crew, one roof — for productions that used to need five locations.',
      ctaPrimary: 'Commission a production', ctaPrimaryHref: '#produktion', ctaGhost: 'Rent the studio', ctaGhostHref: '#studio',
      chipsLabel: 'Switch the backdrop – as fast as it happens on the day',
      chips: [
        { target: 'desert', label: 'Desert · Morocco' },
        { target: 'skyline', label: 'Skyline · Night' },
        { target: 'halle', label: 'Factory floor' },
        { target: 'alpen', label: 'Alpine panorama' },
      ],
      scrollHint: 'Scroll', showreel: 'Watch showreel',
    },
    proof: [
      { num: 5, text: 'Locations in a single shoot day – swap the backdrop in minutes instead of moving the whole crew.' },
      { num: 50, suf: 'm²', text: 'LED volume with camera tracking and an Unreal Engine workflow – the set is always where you are.' },
      { num: 45, suf: '+', text: 'Productions for clients from Siemens to KUKA – your virtual company set keeps shooting indefinitely.' },
    ],
    showreel: { eyebrow: 'Showreel', h2: 'Seeing beats explaining.', lede: 'One look at the LED wall says more than any spec sheet – your showreel goes here.', caption: 'CreativeCinema · Showreel 2026', play: 'Play showreel' },
    scenesKicker: 'Five locations · one shoot day',
    scenes: [
      { num: '01', name: 'Desert · Morocco', desc: 'The product film in the desert before lunch – no flights, no permits, no sandstorm risk.', bd: 'bd-desert' },
      { num: '02', name: 'Skyline · Night', desc: 'The keynote in front of the night skyline – a broadcast-grade backdrop, not an office wall.', bd: 'bd-skyline' },
      { num: '03', name: 'Factory floor', desc: 'The recruiting video on the factory floor – without shutting down live production.', bd: 'bd-halle' },
      { num: '04', name: 'Alpine panorama', desc: 'The brand spot in the Alps to close the day. Four worlds, one studio, one single day.', bd: 'bd-alpen' },
    ],
    scenesRail: ['Desert', 'Skyline', 'Factory', 'Alps'],
    twoWays: {
      eyebrow: 'What are you looking for?', h2: 'Two ways into the studio.',
      cards: [
        { eyebrow: 'For brands', title: 'Commission a production', desc: 'Brand film, recruiting video, trade-fair film, livestream or monthly content on retainer – conceived, shot and edited by one team, under one roof.', link: 'See productions', href: '#produktion' },
        { eyebrow: 'For agencies, photographers & productions', title: 'Rent the studio', desc: 'The LED stage as your set: bookable from half-day slots, dry hire or with our operator. Bring your own Unreal environments or pick from our set library.', link: 'Studio rental', href: '#studio' },
      ],
    },
    studio: {
      eyebrow: 'Studio rental · near Nuremberg', h2: 'Rent the LED studio in Germany – from half-day slots.',
      lede: "Northern Bavaria's virtual production stage for film, photo and livestream. Shoot in front of any backdrop in the world without leaving the studio – with parking at the door and ground-level load-in.",
      specs: [
        ['LED area', '50 m² high-resolution LED wall'],
        ['Tracking', 'Camera tracking for perspective-correct backgrounds (in-camera VFX)'],
        ['Engine', 'Unreal Engine workflow, real-time environments, bring your own content as a file'],
        ['Light & sound', 'Professional lighting, audio, make-up and green room'],
        ['Alternative', 'Greenscreen setup available on request'],
        ['Location', 'Gundstraße 13a, 91056 Erlangen · 20 min from Nuremberg'],
      ],
      prices: [
        { name: 'Dry hire', desc: 'Studio + LED tech, your team produces.', tag: 'from €1,450 / ½ day' },
        { name: 'Studio + operator', desc: 'Our LED/tracking operator supports your crew.', tag: 'from €2,500 / day', featured: true },
        { name: 'Full service', desc: 'Crew, lighting, camera and directing support – quote in 24 h.', tag: 'on request' },
      ],
      cta: 'Check availability', ctaHref: '#kontakt',
    },
    vp: {
      eyebrow: 'Virtual Production', h2: 'Your film from the XR studio – five locations in one shoot day.',
      lede: 'Product film in the desert, recruiting video on the factory roof, keynote in front of the skyline – in a single shoot day, in Germany. Concept, shoot, LED stage and post production under one roof.',
      uses: [
        { tag: 'Brand', title: 'Brand & product films', desc: "Brand worlds that don't physically exist – photoreal and visible in real time on set." },
        { tag: 'HR', title: 'Recruiting videos', desc: 'One shoot day, five backdrops, finished clips for careers page and social – at a fixed price.' },
        { tag: 'Events', title: 'Trade-fair films', desc: 'Your stand becomes larger than the hall allows – without shooting in your live operation.' },
        { tag: 'Live', title: 'Livestreams & events', desc: 'Town halls and keynotes with a broadcast-grade backdrop instead of an office wall.' },
        { tag: 'Retainer', title: 'Content retainers', desc: 'Monthly reels and series formats from your fixed virtual set – predictable and recognisable.' },
        { tag: 'Data', title: 'CAD becomes set', desc: 'Your product and plant data (CAD, BIM, 3D) become a walkable film set.' },
      ],
      callout: { kicker: 'The efficiency lever', title: 'Build once, shoot forever: your virtual company set.', text: 'We digitise your brand world – showroom, factory floor or an abstract brand environment – once, as an Unreal Engine set. Every further production starts in the finished set from minute one: predictable, recognisable, at a fraction of the usual production time. That is the basis of our content retainers.' },
    },
    incamera: {
      eyebrow: 'In-camera, not greenscreen', h2: 'Greenscreen is history.',
      lede: 'On the LED wall the finished world is already there on set – real reflections, real light, no nasty surprises in post. Drag the slider.',
      before: 'Greenscreen', after: 'In-camera · LED',
    },
    compare: {
      eyebrow: 'Honestly costed', h2: 'What does a shoot day really cost?',
      left: { title: 'Classic location shoot', tagline: 'Travel, permits, weather – re-costed for every project.', items: [['Location & permits', 'from €1,500'], ['Travel & crew accommodation', 'from €1,200'], ['Rig/travel time between setups', '2–4 h/day'], ['Weather risk / reshoot', 'unpredictable'], ['Locations per shoot day', '1–2']] },
      right: { title: 'Virtual production at CreativeCinema', tagline: 'One studio, every backdrop, a budget you can plan.', items: [['Location & permits', '€0'], ['Travel & accommodation', '€0'], ['Backdrop change', 'minutes'], ['Weather risk', 'none'], ['Locations per shoot day', '5+']] },
      cta: 'Open the interactive cost calculator', ctaHref: '#vergleich',
    },
    projects: { eyebrow: 'Work', h2: 'References in numbers, not adjectives.', lede: '45+ productions for clients including Siemens, KUKA, Daimler and Philips – each case study will state the shoot days, locations and budget saved.', logos: ['SIEMENS', 'KUKA', 'DAIMLER', 'PHILIPS', '+ Your brand'], cases: [{ client: 'Siemens Healthineers', metric: '3 locations → 1 shoot day' }, { client: 'KUKA', metric: 'Recruiting series from the company set' }, { client: 'Philips', metric: 'Product film, zero travel' }] },
    faq: {
      eyebrow: 'FAQ', h2: 'Before you get in touch.',
      items: [
        { q: 'Can I rent the studio without virtual production experience?', a: 'Yes. In the “studio + operator” model our team runs the LED wall, tracking and Unreal Engine – your team focuses on camera and content.' },
        { q: 'What does a virtual production cost?', a: 'Entry-level projects such as the recruiting day start in the low five figures – with locations, travel and shoot days saved, the total budget is often below that of a classic shoot.' },
        { q: "Can you tell it isn't real?", a: 'With correct tracking and lighting: no. The environment reacts in perspective-correct fashion to every camera move – unlike greenscreen, you see the finished image on set.' },
        { q: 'Do you work with English-speaking crews?', a: 'Yes. We work in English with international brands and agencies, and act as your production partner and fixer in Germany.' },
        { q: 'Can we use our CAD / 3D data?', a: 'Yes. Product and plant data (CAD, BIM, 3D models) are prepared for Unreal Engine and turned into a walkable film set.' },
      ],
    },
    contact: {
      eyebrow: 'Contact', h2: 'Lock in your shoot date – reply within 24 hours.',
      lede: 'Send us your preferred date and your project. In a free 15-minute tech briefing we clarify environments, camera and workflow.',
      ctaPrimary: 'Check availability', ctaGhost: 'Open-studio dates',
      nap: ['Gundstraße 13a · 91056 Erlangen, Germany', '20 min from Nuremberg · parking on site', 'as@creative-cinema.net'],
      claim: 'Direct. Innovative. Production-proof.',
    },
    footer: { copy: '© 2026 CreativeCinema GmbH, Erlangen, Germany · At home in the cosmos of media.', links: [{ label: 'Deutsch', href: '/' }, { label: 'Imprint', href: '/impressum/' }, { label: 'Privacy', href: '/datenschutz/' }] },
  },
};
