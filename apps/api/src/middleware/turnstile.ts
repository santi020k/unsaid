import { createMiddleware } from 'hono/factory'

import type { Bindings } from '../types.js'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const VERIFY_TIMEOUT_MS = 8_000

interface TurnstileResult {
  success?: boolean
  hostname?: string
  'error-codes'?: string[]
}

const parseAllowedHostnames = (raw: string | undefined): string[] => {
  if (!raw) return []

  return raw.split(',').map(hostname => hostname.trim()).filter(Boolean)
}

const hasAllowedHostname = (result: TurnstileResult, rawAllowedHostnames: string | undefined): boolean => {
  const allowedHostnames = parseAllowedHostnames(rawAllowedHostnames)

  if (allowedHostnames.length === 0) return true

  if (!result.hostname) return false

  return allowedHostnames.includes(result.hostname)
}

export const validateTurnstile = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  let body: { captchaToken?: unknown }

  try {
    body = await c.req.json<{ captchaToken?: unknown }>()
  } catch {
    return c.json({ error: 'Invalid JSON body.' }, 400)
  }

  if (typeof body.captchaToken !== 'string' || body.captchaToken.trim() === '') {
    return c.json({ error: 'Missing CAPTCHA token.' }, 400)
  }

  const form = new FormData()

  form.append('secret', c.env.TURNSTILE_SECRET_KEY)

  form.append('response', body.captchaToken)

  form.append('remoteip', c.req.header('CF-Connecting-IP') ?? '')

  let result: TurnstileResult

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS)
    })

    if (!res.ok) {
      return c.json({ error: 'CAPTCHA validation unavailable.' }, 503)
    }

    result = await res.json<TurnstileResult>()
  } catch {
    return c.json({ error: 'CAPTCHA validation unavailable.' }, 503)
  }

  if (!result.success) {
    return c.json({ error: 'CAPTCHA validation failed.' }, 403)
  }

  if (!hasAllowedHostname(result, c.env.TURNSTILE_ALLOWED_HOSTNAMES)) {
    return c.json({ error: 'CAPTCHA validation failed.' }, 403)
  }

  await next()
})
