import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://parallaxin.github.io',
  base: '/parallaxin/',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory'
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'fa', 'fr', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
