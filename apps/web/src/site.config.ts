/** Cloudflare Turnstile dummy site key — only for local dev; always passes verification with matching secret. */
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const DEFAULT_API_URL = 'http://localhost:8787'

/** Workers API origin (no trailing slash). Empty env must not become a relative URL. */
const resolveApiUrl = (): string => {
  const raw = import.meta.env.PUBLIC_API_URL

  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim().replace(/\/+$/, '')
  }

  return DEFAULT_API_URL
}

export const SITE = {
  name: 'Unsaid',
  url: 'https://unsaid.santi020k.com',
  description: 'The things everyone knows. The things nobody says.',
  repositoryUrl: 'https://github.com/santi020k/unsaid',
  authorUrl: 'https://santi020k.com',
  defaultLocale: 'en' as const,
  locales: ['en', 'es'] as const,
  apiUrl: resolveApiUrl(),
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ??
      (import.meta.env.DEV ? TURNSTILE_TEST_SITE_KEY : '')
}

export type SupportedLocale = (typeof SITE.locales)[number]
