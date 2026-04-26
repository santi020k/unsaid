export interface Bindings {
  DB: D1Database
  RATE_LIMIT: KVNamespace
  TURNSTILE_SECRET_KEY: string
  ALLOWED_ORIGIN: string
}
