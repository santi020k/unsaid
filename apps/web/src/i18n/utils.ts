import { ui, type UIKey } from './ui.js'

import type { SupportedLocale } from '@/site.config.js'

const normalizePathname = function (pathname: string): string {
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
export const getLocalePaths = function (pathname: string): { en: string, es: string } {
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

export const getAlternatePath = function (
  locale: SupportedLocale,
  pathname: string
): string {
  const paths = getLocalePaths(pathname)

  return locale === 'en' ? paths.es : paths.en
}

const getLocaleString = function (locale: SupportedLocale, key: UIKey): string {
  const table = locale === 'en' ? ui.en : ui.es

  // Reflect.get avoids `table[key]`, which eslint-plugin-security flags; key is UIKey (a closed set).
  return Reflect.get(table, key)
}

export const useTranslations = function (locale: SupportedLocale) {
  return function t(
    key: UIKey,
    vars?: Record<string, string | number>
  ): string {
    const raw = getLocaleString(locale, key)

    if (!vars) return raw

    return Object.entries(vars).reduce<string>(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)), raw
    )
  }
}

export const getAlternateLocale = function (locale: SupportedLocale): SupportedLocale {
  return locale === 'en' ? 'es' : 'en'
}
