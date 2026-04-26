import { ui, type UIKey } from './ui.js'

import type { SupportedLocale } from '@/site.config.js'

function normalizePathname(pathname: string): string {
  if (pathname === '/es' || pathname === '/es/') {
    return '/es/'
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/'
  }

  return pathname
}

/**
 * Resolves the English and Spanish URLs for the current logical page (for hreflang and the language switcher).
 */
export function getLocalePaths(pathname: string): { en: string, es: string } {
  const p = normalizePathname(pathname)

  if (p === '/' || p === '/es' || p === '/es/') {
    return { en: '/', es: '/es/' }
  }

  if (p.startsWith('/es/') && p.length > 4) {
    const enPath = p.slice(3)

    return { en: enPath.startsWith('/') ? enPath : `/${enPath}`, es: p }
  }

  if (p.startsWith('/')) {
    return { en: p, es: `/es${p === '/' ? '/' : p}` }
  }

  return { en: '/', es: '/es/' }
}

export function getAlternatePath(
  locale: SupportedLocale,
  pathname: string
): string {
  const paths = getLocalePaths(pathname)

  return locale === 'en' ? paths.es : paths.en
}

export function useTranslations(locale: SupportedLocale) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    const raw = ui[locale][key] as string

    if (!vars) return raw

    return Object.entries(vars).reduce<string>(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)), raw
    )
  }
}

export function getAlternateLocale(locale: SupportedLocale): SupportedLocale {
  return locale === 'en' ? 'es' : 'en'
}
