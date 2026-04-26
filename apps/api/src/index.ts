import { type Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { posts } from './routes/posts.js'
import type { Bindings } from './types.js'

const app = new Hono<{ Bindings: Bindings }>()

const parseOrigins = (raw: string | undefined): string[] => {
  const origins = raw?.split(',') ?? []

  return origins.map(origin => origin.trim()).filter(Boolean)
}

const resolveCorsOrigin = (origin: string, c: Context<{ Bindings: Bindings }>): string | null => {
  const allowedOrigins = [
    ...parseOrigins(c.env.ALLOWED_ORIGINS),
    ...parseOrigins(c.env.ALLOWED_ORIGIN)
  ]

  return allowedOrigins.includes(origin) ? origin : null
}

app.use('*', logger())

app.use(
  '/api/*', cors({
    origin: resolveCorsOrigin,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400
  })
)

app.get('/api/health', c => c.json({ status: 'ok' }))

app.route('/api/posts', posts)

app.notFound(c => c.json({ error: 'Not found.' }, 404))

app.onError((err, c) => {
  console.error(err)

  return c.json({ error: 'Internal server error.' }, 500)
})

export default app
