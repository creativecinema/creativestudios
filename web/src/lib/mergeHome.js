// Legt Storyblok-Inhalt über die Defaults aus home.ts. Jedes gepflegte Feld /
// jede Liste überschreibt; leere bleiben Default → die Seite bricht nie.
// Wird von index.astro (DE) und en/index.astro (EN) genutzt.
const lines = (s) => (typeof s === 'string' ? s.split('\n').map((x) => x.trim()).filter(Boolean) : null);
const arr = (v) => (Array.isArray(v) && v.length ? v : null);

export function mergeHome(base, c) {
  const t = structuredClone(base);
  const set = (path, val) => {
    if (val === undefined || val === null || val === '') return;
    const k = path.split('.'); let o = t;
    for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
    o[k[k.length - 1]] = val;
  };
  set('meta.title', c.meta_title); set('meta.description', c.meta_description);
  set('hero.kicker', c.hero_kicker); set('hero.h1', c.hero_h1); set('hero.h1hl', c.hero_h1hl); set('hero.h1rest', c.hero_h1rest); set('hero.sub', c.hero_sub);
  set('hero.stage', c.hero_stage); set('hero.claim', c.hero_claim);
  set('hero.ctaPrimary', c.hero_cta_primary); set('hero.ctaPrimaryHref', c.hero_cta_primary_href); set('hero.ctaGhost', c.hero_cta_ghost); set('hero.ctaGhostHref', c.hero_cta_ghost_href);
  set('hero.scrollHint', c.hero_scroll_hint); set('hero.showreel', c.hero_showreel); set('hero.chipsLabel', c.hero_chips_label);
  set('showreel.eyebrow', c.showreel_eyebrow); set('showreel.h2', c.showreel_h2); set('showreel.lede', c.showreel_lede); set('showreel.caption', c.showreel_caption); set('showreel.play', c.showreel_play);
  set('scenesKicker', c.scenes_kicker);
  set('twoWays.eyebrow', c.twoways_eyebrow); set('twoWays.h2', c.twoways_h2);
  set('studio.eyebrow', c.studio_eyebrow); set('studio.h2', c.studio_h2); set('studio.lede', c.studio_lede); set('studio.cta', c.studio_cta); set('studio.ctaHref', c.studio_cta_href);
  set('vp.eyebrow', c.vp_eyebrow); set('vp.h2', c.vp_h2); set('vp.lede', c.vp_lede);
  set('vp.callout.kicker', c.vp_callout_kicker); set('vp.callout.title', c.vp_callout_title); set('vp.callout.text', c.vp_callout_text);
  set('incamera.eyebrow', c.incamera_eyebrow); set('incamera.h2', c.incamera_h2); set('incamera.lede', c.incamera_lede); set('incamera.before', c.incamera_before); set('incamera.after', c.incamera_after);
  set('compare.eyebrow', c.compare_eyebrow); set('compare.h2', c.compare_h2);
  set('compare.left.title', c.compare_left_title); set('compare.left.tagline', c.compare_left_tagline);
  set('compare.right.title', c.compare_right_title); set('compare.right.tagline', c.compare_right_tagline);
  set('compare.cta', c.compare_cta); set('compare.ctaHref', c.compare_cta_href);
  set('projects.eyebrow', c.projects_eyebrow); set('projects.h2', c.projects_h2); set('projects.lede', c.projects_lede);
  set('faq.eyebrow', c.faq_eyebrow); set('faq.h2', c.faq_h2);
  set('contact.eyebrow', c.contact_eyebrow); set('contact.h2', c.contact_h2); set('contact.lede', c.contact_lede);
  set('contact.ctaPrimary', c.contact_cta_primary); set('contact.ctaGhost', c.contact_cta_ghost); set('contact.claim', c.contact_claim);
  set('nav.cta', c.nav_cta); set('footer.copy', c.footer_copy);

  if (arr(c.hero_chips)) t.hero.chips = c.hero_chips.map((b) => ({ target: b.target, label: b.label }));
  if (arr(c.proof)) t.proof = c.proof.map((b) => ({ num: Number(b.num) || 0, suf: b.suf || undefined, text: b.text }));
  if (arr(c.scenes)) t.scenes = c.scenes.map((b) => ({ num: b.num, name: b.name, desc: b.desc, bd: b.bd }));
  if (lines(c.scenes_rail)) t.scenesRail = lines(c.scenes_rail);
  if (arr(c.twoways_cards)) t.twoWays.cards = c.twoways_cards.map((b) => ({ eyebrow: b.eyebrow, title: b.title, desc: b.desc, link: b.link, href: b.href }));
  if (arr(c.studio_specs)) t.studio.specs = c.studio_specs.map((b) => [b.label, b.value]);
  if (arr(c.studio_prices)) t.studio.prices = c.studio_prices.map((b) => ({ name: b.name, desc: b.desc, tag: b.tag, featured: !!b.featured }));
  if (arr(c.vp_uses)) t.vp.uses = c.vp_uses.map((b) => ({ tag: b.tag, title: b.title, desc: b.desc }));
  if (arr(c.compare_left_items)) t.compare.left.items = c.compare_left_items.map((b) => [b.label, b.value]);
  if (arr(c.compare_right_items)) t.compare.right.items = c.compare_right_items.map((b) => [b.label, b.value]);
  if (lines(c.projects_logos)) t.projects.logos = lines(c.projects_logos);
  if (arr(c.projects_cases)) t.projects.cases = c.projects_cases.map((b) => ({ client: b.client, metric: b.metric }));
  if (arr(c.faq_items)) t.faq.items = c.faq_items.map((b) => ({ q: b.q, a: b.a }));
  if (lines(c.contact_nap)) t.contact.nap = lines(c.contact_nap);
  if (arr(c.nav_links)) t.nav.links = c.nav_links.map((b) => ({ label: b.label, href: b.href }));
  if (arr(c.footer_links)) t.footer.links = c.footer_links.map((b) => ({ label: b.label, href: b.href }));
  return t;
}
