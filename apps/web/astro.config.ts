import { defineConfig, sessionDrivers } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://unsaid.santi020k.com',
  output: 'server',
  adapter: cloudflare(),
  session: {
    // Prevent the Cloudflare adapter from auto-provisioning a persistent SESSION KV binding.
    // The app does not call Astro sessions, so no identity/session cookie is created.
    driver: sessionDrivers.lruCache()
  },
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
