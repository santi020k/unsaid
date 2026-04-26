import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://unsaid.app',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  integrations: [
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
