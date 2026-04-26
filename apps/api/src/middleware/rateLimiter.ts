import { createMiddleware } from 'hono/factory'

import type { Bindings } from '../types.js'

import { DAILY_LIMIT } from '@unsaid/shared'

export const rateLimiter = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const today = new Date().toISOString().split('T')[0]
  const key = `rate:${ip}:${today}`
  const raw = await c.env.RATE_LIMIT.get(key)
  const count = raw ? parseInt(raw, 10) : 0

  if (count >= DAILY_LIMIT) {
    return c.json({ error: 'Daily limit reached. Come back tomorrow.' }, 429)
  }

  await c.env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 86400 })

  await next()
})
