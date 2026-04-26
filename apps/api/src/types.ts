export interface Bindings {
  DB: D1Database
  RATE_LIMIT: KVNamespace
  TURNSTILE_SECRET_KEY: string
  ALLOWED_ORIGIN: string
  ENABLE_AUTO_TRANSLATION?: string
  TURNSTILE_ALLOWED_HOSTNAMES?: string

  /** When "true" (e.g. from apps/api/.dev.vars), skips per-IP daily post count. */
  DISABLE_POST_RATE_LIMIT?: string
}
