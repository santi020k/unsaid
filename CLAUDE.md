# CLAUDE.md — Unsaid

This file gives AI agents full context for working on this codebase. Read it entirely before making any changes.

---

## Project overview

**Unsaid** is an anonymous truth-sharing platform. Users post short, honest observations about life — no accounts, no tracking. The stack is entirely Cloudflare-native.

Key constraints that must never be violated:
- **No authentication.** Zero user accounts, zero sessions, zero cookies for identity.
- **CAPTCHA on every post.** Cloudflare Turnstile token must be validated server-side before inserting a record.
- **Rate limiting.** Max 3 posts per IP per calendar day, enforced via Cloudflare KV.
- **Anonymous by design.** No IP addresses stored in D1. No fingerprinting stored.
- **i18n from day one.** All UI strings live in `apps/web/src/i18n/ui.ts`. No hardcoded copy.

---

## Architecture

```
apps/web   →  Astro 6 + Tailwind v4  →  Cloudflare Worker + static assets (SSR via @astrojs/cloudflare)
apps/api   →  Hono 4               →  Cloudflare Workers (wrangler deploy)
packages/shared  →  TypeScript types used by both apps (Post, CreatePostBody, etc.)
```

The frontend SSR-fetches the initial post list at request time. If that fetch fails, the feed loads client-side via the `TruthFeed` component's JS. The API handles CAPTCHA validation and rate limiting as middleware before the route handler runs.

---

## Tech stack (exact versions)

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 22 | See `.node-version` |
| pnpm | 10.32.1 | Pinned in `packageManager` field |
| Turborepo | ^2.5.4 | Task orchestration |
| Astro | ^6.1.9 | `output: 'server'` mode |
| `@astrojs/cloudflare` | ^13.x | Adapter for Cloudflare Workers (not legacy Pages static hosting) |
| Tailwind CSS | ^4.x | v4 syntax — `@theme`, `@utility`, not `theme.extend` |
| Hono | ^4.12.x | Cloudflare Workers framework |
| Wrangler | ^4.85.x | CF Workers CLI |
| TypeScript | ^6.x | Strictest mode |
| ESLint | ^10.x | Flat config only |
| `@santi020k/eslint-config-basic` | ^1.5.x | Always use this — never configure ESLint from scratch |

---

## Key files

| File | Purpose |
|---|---|
| `apps/web/src/site.config.ts` | Brand constants, API URL, Turnstile site key, locale defaults |
| `apps/web/src/i18n/ui.ts` | All user-facing strings for `en` and `es` |
| `apps/web/src/i18n/utils.ts` | `useTranslations(locale)` — returns a `t(key)` function |
| `apps/web/src/styles/partials/tokens.css` | All `@theme` design tokens — colors, fonts, radii, shadows |
| `apps/web/src/styles/partials/utilities.css` | All `@utility` blocks — never repeat raw Tailwind classes in templates |
| `apps/api/src/types.ts` | `Bindings` type for D1, KV, env vars |
| `apps/api/src/middleware/rateLimiter.ts` | IP-based rate limiting via KV |
| `apps/api/src/middleware/turnstile.ts` | Turnstile token verification |
| `apps/api/src/routes/posts.ts` | GET (paginated) and POST (with CAPTCHA + rate limit) |
| `apps/api/schema.sql` | D1 schema — run once per environment |
| `apps/api/wrangler.toml` | Workers config — D1 and KV IDs must be filled in before deploy |
| `packages/shared/src/index.ts` | Shared TypeScript types and constants |

---

## Commands to run

Always work from the repo root:

```bash
pnpm dev              # Start web (4321) + api (8787) concurrently
pnpm build            # Full production build via Turbo
pnpm lint             # ESLint all workspaces
pnpm check            # TypeScript type-check all workspaces
pnpm spellcheck       # cspell on .md and .json files
pnpm knip             # Unused code/deps detection

# Per-workspace
pnpm --filter @unsaid/web  <script>
pnpm --filter @unsaid/api  <script>

# D1 local setup (first time)
pnpm --filter @unsaid/api exec wrangler d1 execute unsaid-db --local --file=schema.sql

# Deploy
pnpm --filter @unsaid/api exec wrangler deploy
# Web: pnpm deploy:web  (or CI deploy-web job on push to main)
```

---

## Code conventions

### General

- **ESM only.** All imports use `.js` extensions on relative paths (even for `.ts` source files).
- **Type imports.** Use `import type { Foo }` for type-only imports.
- **No barrel re-exports** unless the package is `packages/shared`.
- **No `any`.** If the linter warns about `any`, use a proper type or `unknown` + a type guard.
- **Conventional Commits.** All commits must follow `type(scope): description` — enforced by `commit-msg` hook.

### Astro components

```astro
---
// 1. Interface Props at the top
interface Props {
  locale: SupportedLocale
}

// 2. Destructure from Astro.props
const { locale } = Astro.props

// 3. All logic in the frontmatter
const t = useTranslations(locale)
---

<!-- 4. use class:list for conditional classes, never template literals -->
<div class:list={['base-class', condition && 'conditional-class']}></div>
```

- Every component that accepts user-visible text must accept a `locale` prop.
- Every new string must be added to both `en` and `es` in `ui.ts` before using it.
- Decorative icons/SVGs must have `aria-hidden="true"`.
- Animations must have a `motion-reduce` fallback — either via `@media (prefers-reduced-motion)` in CSS or `motion-reduce:` Tailwind variant.

### Tailwind / CSS

- **Never** use raw Tailwind utility classes for patterns that repeat across components. Create a `@utility` block in `utilities.css` instead.
- **Never** hardcode colors as hex values in templates. All colors are in `tokens.css` as `@theme` variables and are available as `text-accent`, `bg-void`, etc.
- **Never** use Tailwind v3 syntax (`theme.extend`, `tailwind.config.js`). This project uses v4 — `@theme`, `@utility`, `@plugin`.
- Custom classes used in Astro templates (like `truth-card-interactive`) are defined as `@utility` blocks and won't trigger `better-tailwindcss/no-unknown-classes` because that rule is disabled for `.astro` files.

### Hono / API

- Middleware runs in declaration order. The current order is `validateTurnstile → rateLimiter → zValidator → handler`. Do not reorder.
- All D1 queries use `.prepare().bind().all()` or `.prepare().bind().first()` — never string interpolation.
- Return shape is always `{ data: T }` on success and `{ error: string }` on failure.
- Rate limit key format: `rate:{ip}:{YYYY-MM-DD}` with a 24h TTL.

### i18n

- Default locale is `en`, no URL prefix (`prefixDefaultLocale: false`).
- Spanish lives at `/es/*`.
- To add a new locale: add it to `SITE.locales` in `site.config.ts`, add a new `locales` entry in `astro.config.ts`, create a new page directory, and add translations to `ui.ts`.
- Use `useTranslations(locale)` — never access `ui` directly in components.

---

## Adding a new API route

1. Create `apps/api/src/routes/myRoute.ts`:
```ts
import { Hono } from 'hono'
import type { Bindings } from '../types.js'

const myRoute = new Hono<{ Bindings: Bindings }>()

myRoute.get('/', async (c) => {
  // ...
  return c.json({ data: result })
})

export { myRoute }
```

2. Register in `apps/api/src/index.ts`:
```ts
import { myRoute } from './routes/myRoute.js'
app.route('/api/my-route', myRoute)
```

---

## Adding a new page

1. Create `apps/web/src/pages/my-page.astro` (English).
2. Create `apps/web/src/pages/es/my-page.astro` (Spanish).
3. Add any new strings to both locales in `ui.ts`.
4. Use `BaseLayout` as the outer wrapper — it handles nav, footer, skip link, and scroll-reveal JS.

---

## Design system quick reference

All tokens are in `apps/web/src/styles/partials/tokens.css`.

### Key colors

| Token | Value | Use |
|---|---|---|
| `bg-void` | `#0b0b0b` | Page background |
| `bg-surface` | `#151515` | Cards, forms |
| `text-text-primary` | `#f2ede6` | Body text |
| `text-text-muted` | `#6b7380` | Secondary text |
| `text-accent` | `#e8e000` | Brand accent (yellow) |
| `text-danger` | `#ff4455` | Errors |
| `text-success` | `#00e676` | Success states |

### Key utility classes

| Class | Defined in | Use |
|---|---|---|
| `btn-primary` | `utilities.css` | Yellow CTA button |
| `btn-ghost` | `utilities.css` | Bordered secondary button |
| `truth-card` | `utilities.css` | Static card surface |
| `truth-card-interactive` | `utilities.css` | Card with hover glow |
| `field-surface` | `utilities.css` | Textarea / input styling |
| `section-shell` | `utilities.css` | Max-width centered section |
| `heading-display` | `utilities.css` | Syne bold display text |
| `text-label` | `utilities.css` | Small uppercase label |
| `accent-dot` | `utilities.css` | Small yellow dot decorator |

### Scroll-reveal

Add `data-animate` to any element for a fade-up on scroll.
Add `data-stagger` to a container to stagger-animate its direct children (60ms delay increments).

---

## Cloudflare resource IDs

Before deploying, replace the placeholder IDs in `apps/api/wrangler.toml`:

```toml
[[d1_databases]]
database_id = "REPLACE_WITH_YOUR_D1_ID"    # wrangler d1 create unsaid-db

[[kv_namespaces]]
id = "REPLACE_WITH_YOUR_KV_ID"             # wrangler kv namespace create RATE_LIMIT
```

See `docs/deploy.md` for the complete deployment walkthrough.

---

## What NOT to do

- Do not add authentication. The anonymous-by-design constraint is fundamental.
- Do not store IP addresses in D1. The rate limiter uses KV with TTL — no permanent IP records.
- Do not bypass CAPTCHA validation in the API. Always run `validateTurnstile` before `rateLimiter` before the handler.
- Do not add Tailwind config files (`tailwind.config.js/ts`). This is v4 — all config is in CSS.
- Do not use NestJS or any Node.js-specific runtime. Cloudflare Workers is a V8 isolate.
- Do not commit secrets. Use `wrangler secret put` for production and `.dev.vars` for local dev.
- Do not hardcode locale strings. Everything goes through `ui.ts` + `useTranslations()`.
