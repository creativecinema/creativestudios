// Seed: legt das vollständige Content-Modell in Storyblok an und befüllt die
// Home-Story aus src/data/home.ts (DE). Idempotent: Komponenten werden ge-upsertet.
// Lauf: node scripts/seed-storyblok.mjs
import { readFileSync } from 'node:fs';
import { home } from '../src/data/home.ts';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const PAT = env.STORYBLOK_PAT, SPACE = env.STORYBLOK_SPACE_ID;
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE}`;
const uid = () => crypto.randomUUID();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(method, path, body, tries = 0) {
  await sleep(180); // unter dem 6-req/s-Limit bleiben
  const res = await fetch(BASE + path, {
    method, headers: { Authorization: PAT, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429 && tries < 6) { await sleep(1200 * (tries + 1)); return api(method, path, body, tries + 1); }
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : {} };
}

// Feld-Helfer
const T = (type, dn) => ({ type, display_name: dn, translatable: true });
const P = (type, dn, extra = {}) => ({ type, display_name: dn, ...extra });
const opt = (dn, options) => ({ type: 'option', display_name: dn, use_uuid: false, exclude_empty_option: true, options });
const bloks = (dn, wl) => ({ type: 'bloks', display_name: dn, restrict_components: true, component_whitelist: wl, minimum: 0, maximum: 0 });
const kulisse = (vals) => opt('Kulisse', [
  { name: 'Wüste', value: vals[0] }, { name: 'Skyline', value: vals[1] },
  { name: 'Werkshalle', value: vals[2] }, { name: 'Alpen', value: vals[3] },
]);

// Item-Komponenten (verschachtelbar)
const items = {
  cc_chip: { target: kulisse(['desert', 'skyline', 'halle', 'alpen']), label: T('text', 'Label') },
  cc_proof: { num: P('text', 'Zahl'), suf: P('text', 'Suffix'), text: T('textarea', 'Text') },
  cc_scene: { num: P('text', 'Nr.'), name: T('text', 'Name'), desc: T('textarea', 'Beschreibung'), bd: kulisse(['bd-desert', 'bd-skyline', 'bd-halle', 'bd-alpen']) },
  cc_path: { eyebrow: T('text', 'Eyebrow'), title: T('text', 'Titel'), desc: T('textarea', 'Text'), link: T('text', 'Link-Text'), href: P('text', 'Link-Ziel') },
  cc_spec: { label: T('text', 'Label'), value: T('textarea', 'Wert') },
  cc_price: { name: T('text', 'Name'), desc: T('textarea', 'Beschreibung'), tag: T('text', 'Preis'), featured: P('boolean', 'Hervorgehoben') },
  cc_usecase: { tag: T('text', 'Tag'), title: T('text', 'Titel'), desc: T('textarea', 'Text') },
  cc_cmp: { label: T('text', 'Posten'), value: T('text', 'Wert') },
  cc_case: { client: T('text', 'Kunde'), metric: T('text', 'Kennzahl') },
  cc_faq: { q: T('text', 'Frage'), a: T('textarea', 'Antwort') },
  cc_link: { label: T('text', 'Label'), href: T('text', 'Ziel') }, // href übersetzbar (Sprach-Link)
};

// home-Komponente: alle Felder, gruppiert in Tabs
const homeSchema = {
  t_seo: { type: 'tab', display_name: 'SEO', keys: ['meta_title', 'meta_description'] },
  meta_title: T('text', 'Meta-Title'), meta_description: T('textarea', 'Meta-Description'),
  t_hero: { type: 'tab', display_name: 'Hero', keys: ['hero_kicker', 'hero_h1', 'hero_h1hl', 'hero_h1rest', 'hero_sub', 'hero_stage', 'hero_claim', 'hero_cta_primary', 'hero_cta_primary_href', 'hero_cta_ghost', 'hero_cta_ghost_href', 'hero_scroll_hint', 'hero_showreel', 'hero_chips_label', 'hero_chips'] },
  hero_kicker: T('text', 'Kicker'), hero_h1: T('text', 'Headline (Start)'), hero_h1hl: T('text', 'Highlight (rot)'), hero_h1rest: T('text', 'Headline (Rest)'), hero_sub: T('textarea', 'Subline'),
  hero_stage: T('text', 'Slate – Stage'), hero_claim: T('text', 'Slate – Claim'),
  hero_cta_primary: T('text', 'CTA primär'), hero_cta_primary_href: P('text', 'CTA primär – Ziel'),
  hero_cta_ghost: T('text', 'CTA sekundär'), hero_cta_ghost_href: P('text', 'CTA sekundär – Ziel'),
  hero_scroll_hint: T('text', 'Scroll-Hinweis'), hero_showreel: T('text', 'Showreel-Button'), hero_chips_label: T('text', 'Chips – Label'),
  hero_chips: bloks('Kulissen-Chips', ['cc_chip']),
  t_proof: { type: 'tab', display_name: 'Proof', keys: ['proof'] },
  proof: bloks('Proof-Zahlen', ['cc_proof']),
  t_showreel: { type: 'tab', display_name: 'Showreel', keys: ['showreel_eyebrow', 'showreel_h2', 'showreel_lede', 'showreel_caption', 'showreel_play'] },
  showreel_eyebrow: T('text', 'Eyebrow'), showreel_h2: T('text', 'H2'), showreel_lede: T('textarea', 'Lede'), showreel_caption: T('text', 'Caption'), showreel_play: T('text', 'Play-Label'),
  t_scenes: { type: 'tab', display_name: 'Szenen', keys: ['scenes_kicker', 'scenes', 'scenes_rail'] },
  scenes_kicker: T('text', 'Kicker'), scenes: bloks('Szenen', ['cc_scene']), scenes_rail: T('textarea', 'Rail-Labels (eine pro Zeile)'),
  t_two: { type: 'tab', display_name: 'Zwei Wege', keys: ['twoways_eyebrow', 'twoways_h2', 'twoways_cards'] },
  twoways_eyebrow: T('text', 'Eyebrow'), twoways_h2: T('text', 'H2'), twoways_cards: bloks('Karten', ['cc_path']),
  t_studio: { type: 'tab', display_name: 'Studio', keys: ['studio_eyebrow', 'studio_h2', 'studio_lede', 'studio_specs', 'studio_prices', 'studio_cta', 'studio_cta_href'] },
  studio_eyebrow: T('text', 'Eyebrow'), studio_h2: T('text', 'H2'), studio_lede: T('textarea', 'Lede'),
  studio_specs: bloks('Spezifikationen', ['cc_spec']), studio_prices: bloks('Preise', ['cc_price']), studio_cta: T('text', 'CTA'), studio_cta_href: P('text', 'CTA – Ziel'),
  t_vp: { type: 'tab', display_name: 'Virtual Production', keys: ['vp_eyebrow', 'vp_h2', 'vp_lede', 'vp_uses', 'vp_callout_kicker', 'vp_callout_title', 'vp_callout_text'] },
  vp_eyebrow: T('text', 'Eyebrow'), vp_h2: T('text', 'H2'), vp_lede: T('textarea', 'Lede'), vp_uses: bloks('Use-Cases', ['cc_usecase']),
  vp_callout_kicker: T('text', 'Callout – Kicker'), vp_callout_title: T('text', 'Callout – Titel'), vp_callout_text: T('textarea', 'Callout – Text'),
  t_inc: { type: 'tab', display_name: 'In-Camera', keys: ['incamera_eyebrow', 'incamera_h2', 'incamera_lede', 'incamera_before', 'incamera_after'] },
  incamera_eyebrow: T('text', 'Eyebrow'), incamera_h2: T('text', 'H2'), incamera_lede: T('textarea', 'Lede'), incamera_before: T('text', 'Tag links'), incamera_after: T('text', 'Tag rechts'),
  t_cmp: { type: 'tab', display_name: 'Vergleich', keys: ['compare_eyebrow', 'compare_h2', 'compare_left_title', 'compare_left_tagline', 'compare_left_items', 'compare_right_title', 'compare_right_tagline', 'compare_right_items', 'compare_cta', 'compare_cta_href'] },
  compare_eyebrow: T('text', 'Eyebrow'), compare_h2: T('text', 'H2'),
  compare_left_title: T('text', 'Links – Titel'), compare_left_tagline: T('text', 'Links – Tagline'), compare_left_items: bloks('Links – Zeilen', ['cc_cmp']),
  compare_right_title: T('text', 'Rechts – Titel'), compare_right_tagline: T('text', 'Rechts – Tagline'), compare_right_items: bloks('Rechts – Zeilen', ['cc_cmp']),
  compare_cta: T('text', 'CTA'), compare_cta_href: P('text', 'CTA – Ziel'),
  t_proj: { type: 'tab', display_name: 'Projekte', keys: ['projects_eyebrow', 'projects_h2', 'projects_lede', 'projects_logos', 'projects_cases'] },
  projects_eyebrow: T('text', 'Eyebrow'), projects_h2: T('text', 'H2'), projects_lede: T('textarea', 'Lede'), projects_logos: T('textarea', 'Logos (eine pro Zeile)'), projects_cases: bloks('Cases', ['cc_case']),
  t_faq: { type: 'tab', display_name: 'FAQ', keys: ['faq_eyebrow', 'faq_h2', 'faq_items'] },
  faq_eyebrow: T('text', 'Eyebrow'), faq_h2: T('text', 'H2'), faq_items: bloks('Fragen', ['cc_faq']),
  t_contact: { type: 'tab', display_name: 'Kontakt', keys: ['contact_eyebrow', 'contact_h2', 'contact_lede', 'contact_cta_primary', 'contact_cta_ghost', 'contact_nap', 'contact_claim'] },
  contact_eyebrow: T('text', 'Eyebrow'), contact_h2: T('text', 'H2'), contact_lede: T('textarea', 'Lede'), contact_cta_primary: T('text', 'CTA primär'), contact_cta_ghost: T('text', 'CTA sekundär'), contact_nap: T('textarea', 'Adresse (eine Zeile pro Zeile)'), contact_claim: T('text', 'Claim'),
  t_nav: { type: 'tab', display_name: 'Navigation', keys: ['nav_cta', 'nav_links', 'footer_copy', 'footer_links'] },
  nav_cta: T('text', 'Nav – CTA'), nav_links: bloks('Nav-Links', ['cc_link']), footer_copy: T('textarea', 'Footer – Copy'), footer_links: bloks('Footer-Links', ['cc_link']),
};

// ---- Upsert-Logik ----
const { data: existing } = await api('GET', '/components/');
const byName = Object.fromEntries((existing.components || []).map((c) => [c.name, c.id]));
async function upsert(name, schema, opts = {}) {
  const payload = { component: { name, display_name: opts.display_name || name, is_root: !!opts.root, is_nestable: opts.root ? false : true, color: opts.root ? '#C23336' : undefined, schema } };
  if (byName[name]) { const r = await api('PUT', `/components/${byName[name]}`, payload); console.log('PUT', name, r.status); }
  else { const r = await api('POST', '/components/', payload); console.log('POST', name, r.status); }
}
for (const [name, schema] of Object.entries(items)) await upsert(name, schema);
await upsert('home', homeSchema, { root: true, display_name: 'Startseite' });

// ---- Inhalt aus home.de + EN-Übersetzungen aus home.en bauen ----
const d = home.de, en = home.en;
const content = { component: 'home' };
// Skalar mit DE-Wert + (falls vorhanden) EN als __i18n__en
const s = (key, dv, ev) => { content[key] = dv; if (ev != null && ev !== '') content[key + '__i18n__en'] = ev; };
// Blok-Builder: DE-Felder + __i18n__en für übersetzbare Felder
const chip = (a, b) => ({ component: 'cc_chip', _uid: uid(), target: a.target, label: a.label, label__i18n__en: b.label });
const proof = (a, b) => ({ component: 'cc_proof', _uid: uid(), num: String(a.num), suf: a.suf || '', text: a.text, text__i18n__en: b.text });
const scene = (a, b) => ({ component: 'cc_scene', _uid: uid(), num: a.num, name: a.name, desc: a.desc, bd: a.bd, name__i18n__en: b.name, desc__i18n__en: b.desc });
const path = (a, b) => ({ component: 'cc_path', _uid: uid(), eyebrow: a.eyebrow, title: a.title, desc: a.desc, link: a.link, href: a.href, eyebrow__i18n__en: b.eyebrow, title__i18n__en: b.title, desc__i18n__en: b.desc, link__i18n__en: b.link, href__i18n__en: b.href });
const spec = (a, b) => ({ component: 'cc_spec', _uid: uid(), label: a[0], value: a[1], label__i18n__en: b[0], value__i18n__en: b[1] });
const price = (a, b) => ({ component: 'cc_price', _uid: uid(), name: a.name, desc: a.desc, tag: a.tag, featured: !!a.featured, name__i18n__en: b.name, desc__i18n__en: b.desc, tag__i18n__en: b.tag });
const usecase = (a, b) => ({ component: 'cc_usecase', _uid: uid(), tag: a.tag, title: a.title, desc: a.desc, tag__i18n__en: b.tag, title__i18n__en: b.title, desc__i18n__en: b.desc });
const cmp = (a, b) => ({ component: 'cc_cmp', _uid: uid(), label: a[0], value: a[1], label__i18n__en: b[0], value__i18n__en: b[1] });
const ccase = (a, b) => ({ component: 'cc_case', _uid: uid(), client: a.client, metric: a.metric, client__i18n__en: b.client, metric__i18n__en: b.metric });
const faqB = (a, b) => ({ component: 'cc_faq', _uid: uid(), q: a.q, a: a.a, q__i18n__en: b.q, a__i18n__en: b.a });
const link = (a, b) => ({ component: 'cc_link', _uid: uid(), label: a.label, href: a.href, label__i18n__en: b.label, href__i18n__en: b.href });
const zip = (da, ea, fn) => da.map((x, i) => fn(x, ea[i] ?? x));

s('meta_title', d.meta.title, en.meta.title); s('meta_description', d.meta.description, en.meta.description);
s('hero_kicker', d.hero.kicker, en.hero.kicker); s('hero_h1', d.hero.h1, en.hero.h1); s('hero_h1hl', d.hero.h1hl, en.hero.h1hl); s('hero_h1rest', d.hero.h1rest, en.hero.h1rest); s('hero_sub', d.hero.sub, en.hero.sub);
s('hero_stage', d.hero.stage, en.hero.stage); s('hero_claim', d.hero.claim, en.hero.claim);
s('hero_cta_primary', d.hero.ctaPrimary, en.hero.ctaPrimary); s('hero_cta_primary_href', d.hero.ctaPrimaryHref);
s('hero_cta_ghost', d.hero.ctaGhost, en.hero.ctaGhost); s('hero_cta_ghost_href', d.hero.ctaGhostHref);
s('hero_scroll_hint', d.hero.scrollHint, en.hero.scrollHint); s('hero_showreel', d.hero.showreel, en.hero.showreel); s('hero_chips_label', d.hero.chipsLabel, en.hero.chipsLabel);
content.hero_chips = zip(d.hero.chips, en.hero.chips, chip);
content.proof = zip(d.proof, en.proof, proof);
s('showreel_eyebrow', d.showreel.eyebrow, en.showreel.eyebrow); s('showreel_h2', d.showreel.h2, en.showreel.h2); s('showreel_lede', d.showreel.lede, en.showreel.lede); s('showreel_caption', d.showreel.caption, en.showreel.caption); s('showreel_play', d.showreel.play, en.showreel.play);
s('scenes_kicker', d.scenesKicker, en.scenesKicker);
content.scenes = zip(d.scenes, en.scenes, scene);
s('scenes_rail', d.scenesRail.join('\n'), en.scenesRail.join('\n'));
s('twoways_eyebrow', d.twoWays.eyebrow, en.twoWays.eyebrow); s('twoways_h2', d.twoWays.h2, en.twoWays.h2);
content.twoways_cards = zip(d.twoWays.cards, en.twoWays.cards, path);
s('studio_eyebrow', d.studio.eyebrow, en.studio.eyebrow); s('studio_h2', d.studio.h2, en.studio.h2); s('studio_lede', d.studio.lede, en.studio.lede);
content.studio_specs = zip(d.studio.specs, en.studio.specs, spec);
content.studio_prices = zip(d.studio.prices, en.studio.prices, price);
s('studio_cta', d.studio.cta, en.studio.cta); s('studio_cta_href', d.studio.ctaHref);
s('vp_eyebrow', d.vp.eyebrow, en.vp.eyebrow); s('vp_h2', d.vp.h2, en.vp.h2); s('vp_lede', d.vp.lede, en.vp.lede);
content.vp_uses = zip(d.vp.uses, en.vp.uses, usecase);
s('vp_callout_kicker', d.vp.callout.kicker, en.vp.callout.kicker); s('vp_callout_title', d.vp.callout.title, en.vp.callout.title); s('vp_callout_text', d.vp.callout.text, en.vp.callout.text);
s('incamera_eyebrow', d.incamera.eyebrow, en.incamera.eyebrow); s('incamera_h2', d.incamera.h2, en.incamera.h2); s('incamera_lede', d.incamera.lede, en.incamera.lede); s('incamera_before', d.incamera.before, en.incamera.before); s('incamera_after', d.incamera.after, en.incamera.after);
s('compare_eyebrow', d.compare.eyebrow, en.compare.eyebrow); s('compare_h2', d.compare.h2, en.compare.h2);
s('compare_left_title', d.compare.left.title, en.compare.left.title); s('compare_left_tagline', d.compare.left.tagline, en.compare.left.tagline);
content.compare_left_items = zip(d.compare.left.items, en.compare.left.items, cmp);
s('compare_right_title', d.compare.right.title, en.compare.right.title); s('compare_right_tagline', d.compare.right.tagline, en.compare.right.tagline);
content.compare_right_items = zip(d.compare.right.items, en.compare.right.items, cmp);
s('compare_cta', d.compare.cta || '', en.compare.cta || ''); s('compare_cta_href', d.compare.ctaHref || '');
s('projects_eyebrow', d.projects.eyebrow, en.projects.eyebrow); s('projects_h2', d.projects.h2, en.projects.h2); s('projects_lede', d.projects.lede, en.projects.lede);
s('projects_logos', d.projects.logos.join('\n'), en.projects.logos.join('\n'));
content.projects_cases = zip(d.projects.cases, en.projects.cases, ccase);
s('faq_eyebrow', d.faq.eyebrow, en.faq.eyebrow); s('faq_h2', d.faq.h2, en.faq.h2);
content.faq_items = zip(d.faq.items, en.faq.items, faqB);
s('contact_eyebrow', d.contact.eyebrow, en.contact.eyebrow); s('contact_h2', d.contact.h2, en.contact.h2); s('contact_lede', d.contact.lede, en.contact.lede);
s('contact_cta_primary', d.contact.ctaPrimary, en.contact.ctaPrimary); s('contact_cta_ghost', d.contact.ctaGhost, en.contact.ctaGhost); s('contact_nap', d.contact.nap.join('\n'), en.contact.nap.join('\n')); s('contact_claim', d.contact.claim, en.contact.claim);
s('nav_cta', d.nav.cta, en.nav.cta);
content.nav_links = zip(d.nav.links, en.nav.links, link);
s('footer_copy', d.footer.copy, en.footer.copy);
content.footer_links = zip(d.footer.links, en.footer.links, link);

const r = await api('PUT', '/stories/186597410165364', { story: { name: 'Home', slug: 'home', content }, publish: 1 });
console.log('Home-Story PUT (DE+EN):', r.status, r.status >= 400 ? JSON.stringify(r.data).slice(0, 300) : 'published');
console.log('Felder:', Object.keys(homeSchema).filter((k) => !k.startsWith('t_')).length, '| mit EN-Übersetzung geseedet.');
