import type { D1Database } from '@cloudflare/workers-types'
import type { Locale } from '@unsaid/shared'
import { POST_MAX_LENGTH } from '@unsaid/shared'

const MYMEMORY = 'https://api.mymemory.translated.net/get'

const truncateGraphemes = (text: string, max: number): string => {
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

  return [...seg.segment(text)].slice(0, max).map(s => s.segment).join('')
}

/**
 * Free tier machine translation (MyMemory). Fails softly on quota or network errors.
 */
const translateMyMemory = async (text: string, from: Locale, to: Locale): Promise<string | null> => {
  if (from === to) return null

  const langpair = `${from}|${to}`
  const url = new URL(MYMEMORY)

  url.searchParams.set('q', text)

  url.searchParams.set('langpair', langpair)

  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(12_000) })

    if (!res.ok) return null

    const json: {
      responseStatus?: number
      responseData?: { translatedText?: string }
    } = await res.json()

    if (json.responseStatus !== undefined && json.responseStatus !== 200) return null

    const out = json.responseData?.translatedText?.trim()

    if (!out) return null

    return truncateGraphemes(out, POST_MAX_LENGTH)
  } catch {
    return null
  }
}

interface MirrorPostParams {
  sourceId: string
  content: string
  sourceLocale: Locale
}

/** Inserts the other-locale row linked via `translation_of` (best-effort). */
export const mirrorPostTranslation = async (db: D1Database, params: MirrorPostParams): Promise<void> => {
  const targetLocale: Locale = params.sourceLocale === 'en' ? 'es' : 'en'
  const translated = await translateMyMemory(params.content, params.sourceLocale, targetLocale)

  if (!translated) return

  await db.prepare(
    `INSERT OR IGNORE INTO posts (id, content, locale, translation_of)
     VALUES (lower(hex(randomblob(8))), ?, ?, ?)`
  )
    .bind(translated, targetLocale, params.sourceId)
    .run()
}
