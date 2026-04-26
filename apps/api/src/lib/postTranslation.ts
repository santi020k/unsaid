import type { Ai, D1Database } from '@cloudflare/workers-types'
import type { Locale } from '@unsaid/shared'
import { POST_MAX_LENGTH } from '@unsaid/shared'

interface M2M100Input {
  text: string
  source_lang: string
  target_lang: string
}

interface M2M100Output {
  translated_text: string
}

type RunTranslate = (model: string, input: M2M100Input) => Promise<M2M100Output>

const truncateGraphemes = (text: string, max: number): string => {
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

  return [...seg.segment(text)].slice(0, max).map(s => s.segment).join('')
}

const translateWorkerAI = async (ai: Ai, text: string, from: Locale, to: Locale): Promise<string | null> => {
  if (from === to) return null

  try {
    const input: M2M100Input = { text, source_lang: from, target_lang: to } // eslint-disable-line camelcase
    const result = await (ai.run as unknown as RunTranslate)('@cf/meta/m2m100-1.2b', input)
    const out = result.translated_text.trim()

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

export const mirrorPostTranslation = async (ai: Ai, db: D1Database, params: MirrorPostParams): Promise<void> => {
  const targetLocale: Locale = params.sourceLocale === 'en' ? 'es' : 'en'
  const translated = await translateWorkerAI(ai, params.content, params.sourceLocale, targetLocale)

  if (!translated) return

  await db.prepare(
    `INSERT OR IGNORE INTO posts (id, content, locale, translation_of)
     VALUES (lower(hex(randomblob(8))), ?, ?, ?)`
  )
    .bind(translated, targetLocale, params.sourceId)
    .run()
}
