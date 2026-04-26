/** Cloudflare Turnstile dummy site key — only for local dev; always passes verification with matching secret. */
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'

export const SITE = {
  name: 'Unsaid',
  url: 'https://unsaid.santi020k.com',
  description: 'The things everyone knows. The things nobody says.',
  repositoryUrl: 'https://github.com/santi020k/unsaid',
  authorUrl: 'https://santi020k.com',
  defaultLocale: 'en' as const,
  locales: ['en', 'es'] as const,
  apiUrl: (import.meta.env.PUBLIC_API_URL) ?? 'http://localhost:8787',
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ??
      (import.meta.env.DEV ? TURNSTILE_TEST_SITE_KEY : '')
}

export type SupportedLocale = (typeof SITE.locales)[number]
