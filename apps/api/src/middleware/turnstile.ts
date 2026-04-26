import { createMiddleware } from 'hono/factory'

import type { Bindings } from '../types.js'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const validateTurnstile = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const body = await c.req.json<{ captchaToken?: string }>()

  if (!body.captchaToken) {
    return c.json({ error: 'Missing CAPTCHA token.' }, 400)
  }

  const form = new FormData()

  form.append('secret', c.env.TURNSTILE_SECRET_KEY)

  form.append('response', body.captchaToken)

  form.append('remoteip', c.req.header('CF-Connecting-IP') ?? '')

  const res = await fetch(VERIFY_URL, { method: 'POST', body: form })
  const result = await res.json<{ success: boolean, 'error-codes'?: string[] }>()

  if (!result.success) {
    return c.json({ error: 'CAPTCHA validation failed.' }, 403)
  }

  await next()
})
