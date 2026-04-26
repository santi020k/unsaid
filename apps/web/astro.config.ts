import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import robotsTxt from 'astro-robots-txt'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://unsaid.santi020k.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    icon({
      include: {
        tabler: ['language', 'brand-github']
      }
    }),
    sitemap(),
    robotsTxt()
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    domains: []
  }
})
