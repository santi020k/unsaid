# Unsaid

> The things everyone knows. The things nobody says.

An anonymous platform for sharing hard truths and unfiltered observations about life. No accounts. No tracking. Just truth.

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Astro 6 + Tailwind CSS v4 |
| Backend | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite at the edge) |
| Rate limiting | Cloudflare KV |
| CAPTCHA | Cloudflare Turnstile |
| Hosting | Cloudflare Pages (web) + Workers (api) |
| i18n | Astro i18n routing (`en` default, `es`) |
| Linting | `@santi020k/eslint-config-basic` |

## Monorepo structure

```
unsaid/
├── apps/
│   ├── web/              Astro 6 frontend → Cloudflare Pages
│   └── api/              Hono backend → Cloudflare Workers
├── packages/
│   └── shared/           TypeScript types shared across apps
├── docs/
│   ├── brand.md          Brand guidelines, color system, typography
│   └── deploy.md         Step-by-step Cloudflare deployment guide
└── CLAUDE.md             AI agent context for future development
```

## Getting started

### Prerequisites

- Node.js ≥ 22 (see `.node-version`)
- pnpm ≥ 10 — `npm i -g pnpm`
- Wrangler CLI — installed as a local devDependency

### Install

```bash
git clone <repo>
cd unsaid
pnpm install
```

### Environment variables

Copy the example files and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.dev.vars.example apps/api/.dev.vars
```

| Variable | App | Description |
|---|---|---|
| `PUBLIC_API_URL` | web | Workers API URL (`http://localhost:8787` locally) |
| `PUBLIC_TURNSTILE_SITE_KEY` | web | Turnstile site key (use test key locally) |
| `TURNSTILE_SECRET_KEY` | api | Turnstile secret key (use test key locally) |
| `ALLOWED_ORIGINS` | api | Comma-separated frontend origins for CORS |

**Turnstile test keys** (always pass, safe for local dev):
- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

### Local development

Run both apps simultaneously:

```bash
pnpm dev
```

Or individually:

```bash
pnpm --filter @unsaid/web dev    # http://localhost:4321
pnpm --filter @unsaid/api dev    # http://localhost:8787
```

For the API, you need a local D1 database first:

```bash
pnpm --filter @unsaid/api run db:migrate
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in parallel (watch mode) |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | ESLint across all workspaces |
| `pnpm check` | TypeScript type-check across all workspaces |
| `pnpm test` | Run test suites |
| `pnpm spellcheck` | cspell on Markdown and JSON files |
| `pnpm knip` | Detect unused exports and dependencies |
## Contributing

This project enforces Conventional Commits via a `commit-msg` hook:

```
type(scope): description

# Types: feat | fix | chore | docs | style | refactor | perf | test | ci | build | revert
# Max ~150 chars in the description
```

The `pre-commit` hook runs lint-staged (ESLint + cspell) on staged files.
The `pre-push` hook runs spellcheck, lint, and type-check across all workspaces.

## Documentation

- [Brand guidelines](docs/brand.md) — colors, typography, tone of voice
- [Deployment guide](docs/deploy.md) — step-by-step Cloudflare setup
- [CLAUDE.md](CLAUDE.md) — AI agent context for development sessions
