import { Hono } from 'hono'
import { z } from 'zod'

import { mirrorPostTranslation } from '../lib/postTranslation.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import { validateTurnstile } from '../middleware/turnstile.js'
import type { Bindings } from '../types.js'

import { zValidator } from '@hono/zod-validator'
import { POST_MAX_LENGTH, POST_MIN_LENGTH } from '@unsaid/shared'

/** Row shape returned by INSERT … RETURNING (D1). */
interface InsertedPostRow {
  id: string
  content: string
  locale: string
  translation_of: string | null
  created_at: string
}

const posts = new Hono<{ Bindings: Bindings }>()

const createPostSchema = z.object({
  content: z.string().min(POST_MIN_LENGTH).max(POST_MAX_LENGTH),
  locale: z.enum(['en', 'es']),
  captchaToken: z.string().min(1)
})

const clampFeedLimit = (raw: string | undefined): number => {
  const n = parseInt(raw ?? '20', 10)

  if (!Number.isFinite(n) || n < 1) return 20

  return Math.min(50, n)
}

posts.get('/', async c => {
  const locale = c.req.query('locale')
  const pageRaw = c.req.query('page') ?? '1'
  const page = Math.max(1, parseInt(pageRaw, 10) || 1)
  const limit = clampFeedLimit(c.req.query('limit'))
  const offset = (page - 1) * limit

  const query = locale ?
    'SELECT id, content, locale, translation_of, created_at FROM posts WHERE locale = ? ORDER BY created_at DESC LIMIT ? OFFSET ?' :
    'SELECT id, content, locale, translation_of, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?'

  const { results } = locale ?
    await c.env.DB.prepare(query).bind(locale, limit, offset).all() :
    await c.env.DB.prepare(query).bind(limit, offset).all()

  const { results: countResult } = locale ?
    await c.env.DB.prepare('SELECT COUNT(*) as total FROM posts WHERE locale = ?').bind(locale).all() :
    await c.env.DB.prepare('SELECT COUNT(*) as total FROM posts').all()

  return c.json({ data: { posts: results, total: (countResult[0] as { total: number }).total } })
})

posts.post(
  '/', validateTurnstile, rateLimiter, zValidator('json', createPostSchema), async c => {
    const { content, locale } = c.req.valid('json')

    const post = await c.env.DB.prepare(
      `INSERT INTO posts (id, content, locale)
       VALUES (lower(hex(randomblob(8))), ?, ?)
       RETURNING id, content, locale, translation_of, created_at`
    )
      .bind(content.trim(), locale)
      .first<InsertedPostRow>()

    if (post) {
      c.executionCtx.waitUntil(
        mirrorPostTranslation(c.env.DB, {
          sourceId: post.id,
          content: post.content,
          sourceLocale: locale
        }).catch((err: unknown) => {
          console.error('mirrorPostTranslation', err)
        })
      )
    }

    return c.json({ data: { post } }, 201)
  }
)

export { posts }
