// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

// CreativeCinema – Astro-Konfiguration
// Zweisprachig (DE Standard, EN unter /en/). Inhalte aus Storyblok (Visual Editor),
// mit Fallback auf src/data. `site` -> Canonicals + automatische sitemap.
export default defineConfig({
  site: 'https://creative-cinema.de',
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      apiOptions: { region: 'eu' },
      bridge: true,        // Live-Vorschau im Storyblok Visual Editor
      components: {},      // wir mappen Felder manuell auf Home.astro (kein Blok-Zwang)
    }),
    sitemap(),
  ],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
