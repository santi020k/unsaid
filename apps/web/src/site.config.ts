/** Cloudflare Turnstile dummy site key — only for local dev; always passes verification with matching secret. */
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const DEFAULT_API_URL = 'http://localhost:8787'
const stripTrailingSlashes = (s: string): string => s.replace(/\/+$/, '')

/** Bare host without scheme (e.g. `localhost:8787`, `[::1]:8080`). */
const isLoopbackBareHost = (input: string): boolean => {
  let host = input
  const lastColon = input.lastIndexOf(':')

  if (lastColon !== -1) {
    const afterColon = input.slice(lastColon + 1)

    if (/^\d+$/.test(afterColon)) {
      host = input.slice(0, lastColon)
    }
  }

  const h = host.toLowerCase()

  return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]'
}

/** If PUBLIC_API_URL is a bare hostname, assume https (or http for local loopback). */
const normalizeApiOrigin = (value: string): string => {
  const t = value.trim()

  if (t === '') {
    return DEFAULT_API_URL
  }

  if (/^https?:\/\//i.test(t)) {
    return stripTrailingSlashes(t)
  }

  if (isLoopbackBareHost(t)) {
    return `http://${t}`
  }

  return stripTrailingSlashes(`https://${t.replace(/^\/+/, '')}`)
}

/** Workers API origin (no trailing slash). Empty env must not become a relative URL. */
const resolveApiUrl = (): string => {
  const raw = import.meta.env.PUBLIC_API_URL

  if (typeof raw === 'string' && raw.trim() !== '') {
    return normalizeApiOrigin(raw)
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
