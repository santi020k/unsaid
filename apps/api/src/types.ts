export interface Bindings {
  DB: D1Database
  RATE_LIMIT: KVNamespace
  AI: Ai
  TURNSTILE_SECRET_KEY: string
  ALLOWED_ORIGIN?: string
  ALLOWED_ORIGINS?: string
  ENABLE_AUTO_TRANSLATION?: string
  ENABLE_AI_VALIDATION?: string
  TURNSTILE_ALLOWED_HOSTNAMES?: string

  /** When "true" (e.g. from apps/api/.dev.vars), skips per-IP daily post count. */
  DISABLE_POST_RATE_LIMIT?: string
}
