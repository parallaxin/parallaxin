import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://parallaxin.report',
  integrations: [mdx()],
  output: 'static',
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
