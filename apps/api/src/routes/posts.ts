import { Hono } from 'hono'
import { z } from 'zod'

import { mirrorPostTranslation } from '../lib/postTranslation.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import { validateTurnstile } from '../middleware/turnstile.js'
import type { Bindings } from '../types.js'

import { zValidator } from '@hono/zod-validator'
import { type Post, POST_MAX_LENGTH, POST_MIN_LENGTH, type PostsResponse } from '@unsaid/shared'

/** Row shape returned by INSERT … RETURNING (D1). */
type InsertedPostRow = Post

interface CountRow {
  total: number
}

const FEED_MAX_LIMIT = 50
const FEED_DEFAULT_LIMIT = 20
const numericQueryParam = z.string().regex(/^\d+$/)

const getPostsQuerySchema = z.object({
  locale: z.enum(['en', 'es']).optional(),
  page: numericQueryParam.optional(),
  limit: numericQueryParam.optional()
})

const createPostSchema = z.object({
  content: z.string().min(POST_MIN_LENGTH).max(POST_MAX_LENGTH),
  locale: z.enum(['en', 'es']),
  captchaToken: z.string().min(1)
})

const validationError = { error: 'Invalid request.' } as const

const createPostValidator = zValidator('json', createPostSchema, (result, c) => {
  if (!result.success) {
    return c.json(validationError, 400)
  }
})

const isAutoTranslationEnabled = (raw: string | undefined): boolean => raw === 'true'

const toPositiveInteger = (raw: string | undefined, fallback: number): number => {
  if (!raw) return fallback

  const n = Number(raw)

  if (!Number.isSafeInteger(n) || n < 1) return fallback

  return n
}

const posts = new Hono<{ Bindings: Bindings }>()

posts.get('/', async c => {
  const parsedQuery = getPostsQuerySchema.safeParse({
    locale: c.req.query('locale'),
    page: c.req.query('page'),
    limit: c.req.query('limit')
  })

  if (!parsedQuery.success) {
    return c.json(validationError, 400)
  }

  const { locale } = parsedQuery.data
  const page = toPositiveInteger(parsedQuery.data.page, 1)
  const limit = Math.min(FEED_MAX_LIMIT, toPositiveInteger(parsedQuery.data.limit, FEED_DEFAULT_LIMIT))
  const offset = (page - 1) * limit

  const query = locale ?
    'SELECT id, content, locale, translation_of, created_at FROM posts WHERE locale = ? ORDER BY created_at DESC LIMIT ? OFFSET ?' :
    'SELECT id, content, locale, translation_of, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?'

  const { results } = locale ?
    await c.env.DB.prepare(query).bind(locale, limit, offset).all<Post>() :
    await c.env.DB.prepare(query).bind(limit, offset).all<Post>()

  const { results: countResult } = locale ?
    await c.env.DB.prepare('SELECT COUNT(*) as total FROM posts WHERE locale = ?').bind(locale).all<CountRow>() :
    await c.env.DB.prepare('SELECT COUNT(*) as total FROM posts').all<CountRow>()

  const data: PostsResponse = { posts: results, total: countResult[0]?.total ?? 0 }

  return c.json({ data })
})

posts.post(
  '/', validateTurnstile, rateLimiter, createPostValidator, async c => {
    const { content, locale } = c.req.valid('json')

    const post = await c.env.DB.prepare(
      `INSERT INTO posts (id, content, locale)
       VALUES (lower(hex(randomblob(8))), ?, ?)
       RETURNING id, content, locale, translation_of, created_at`
    )
      .bind(content.trim(), locale)
      .first<InsertedPostRow>()

    if (post && isAutoTranslationEnabled(c.env.ENABLE_AUTO_TRANSLATION)) {
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
