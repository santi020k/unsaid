import { createMiddleware } from 'hono/factory'

import type { Bindings } from '../types.js'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const VERIFY_TIMEOUT_MS = 8_000
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'
const LOCAL_TEST_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

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

const isLocalRequest = (host: string | undefined): boolean => {
  if (!host) return false

  const normalizedHost = host.toLowerCase()

  if (LOCAL_TEST_HOSTS.has(normalizedHost)) return true

  const hostname = normalizedHost.startsWith('[') ?
    normalizedHost.slice(1, normalizedHost.indexOf(']')) :
    normalizedHost.split(':')[0]

  return hostname ? LOCAL_TEST_HOSTS.has(hostname) : false
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

  if (c.env.TURNSTILE_SECRET_KEY === TURNSTILE_TEST_SECRET_KEY && !isLocalRequest(c.req.header('Host'))) {
    return c.json({ error: 'CAPTCHA validation failed.' }, 403)
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

  if (c.env.TURNSTILE_SECRET_KEY !== TURNSTILE_TEST_SECRET_KEY &&
    !hasAllowedHostname(result, c.env.TURNSTILE_ALLOWED_HOSTNAMES)) {
    return c.json({ error: 'CAPTCHA validation failed.' }, 403)
  }

  await next()
})
