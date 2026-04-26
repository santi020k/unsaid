export const SITE = {
  name: 'Unsaid',
  url: 'https://unsaid.app',
  description: 'The things everyone knows. The things nobody says.',
  defaultLocale: 'en' as const,
  locales: ['en', 'es'] as const,
  apiUrl: (import.meta.env.PUBLIC_API_URL) ?? 'http://localhost:8787',
  turnstileSiteKey: (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY) ?? ''
}

export type SupportedLocale = (typeof SITE.locales)[number]
