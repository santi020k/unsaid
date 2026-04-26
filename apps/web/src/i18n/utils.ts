import { ui, type UIKey } from './ui.js'

import type { SupportedLocale } from '@/site.config.js'

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
