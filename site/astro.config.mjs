import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://parallaxin.github.io',
  base: '/parallaxin/',
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