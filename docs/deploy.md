# Cloudflare Deployment Guide

This guide covers deploying Unsaid to Cloudflare from scratch. It assumes you have a Cloudflare account and the repo cloned locally.

Ongoing production deploys should be automated:

- GitHub Actions deploys the Astro frontend as a **Cloudflare Worker** (`pnpm turbo run deploy --filter=@unsaid/web`) after CI passes on `main`.
- GitHub Actions applies D1 migrations and deploys `apps/api` after CI passes on `main`.
- Manual steps below are only for first-time Cloudflare resources, secrets, and domains.

---

## Prerequisites

```bash
# Wrangler CLI is installed as a devDependency — use pnpm exec
pnpm --filter @unsaid/api exec wrangler --version

# Authenticate with Cloudflare
pnpm --filter @unsaid/api exec wrangler login
```

---

## Step 1 — Create the D1 database

```bash
pnpm --filter @unsaid/api exec wrangler d1 create unsaid-db
```

You'll get output like:

```
✅ Successfully created DB 'unsaid-db'

[[d1_databases]]
binding = "DB"
database_name = "unsaid-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Keep the `database_id` private. For local deploys, replace `REPLACE_WITH_YOUR_D1_ID` in `apps/api/wrangler.toml`. For GitHub Actions deploys, add it as the `CLOUDFLARE_D1_DATABASE_ID` repository secret.

---

## Step 2 — Apply D1 migrations

```bash
# Production
pnpm --filter @unsaid/api run db:migrate:remote

# Verify
pnpm --filter @unsaid/api exec wrangler d1 execute unsaid-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

Use the versioned files in `apps/api/migrations/` for production. `schema.sql` is kept as a schema snapshot/reference and for simple local resets.

---

## Step 3 — Create the KV namespace

```bash
pnpm --filter @unsaid/api exec wrangler kv namespace create RATE_LIMIT
```

Output:

```
✅ Successfully created namespace RATE_LIMIT

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Keep the `id` private. For local deploys, replace `REPLACE_WITH_YOUR_KV_ID` in `apps/api/wrangler.toml`. For GitHub Actions deploys, add it as the `CLOUDFLARE_KV_NAMESPACE_ID` repository secret.

> Also create a preview namespace for local dev (optional):
> ```bash
> pnpm --filter @unsaid/api exec wrangler kv namespace create RATE_LIMIT --preview
> # Add preview_id to wrangler.toml locally, or to GitHub as CLOUDFLARE_PREVIEW_KV_NAMESPACE_ID
> ```

---

## Step 4 — Set up Cloudflare Turnstile

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile**
2. Add a site → select "Managed" challenge type
3. Add your domain (`unsaid.santi020k.com`)
4. Copy the **Site Key** (public) and **Secret Key** (private)

The site key must be present at **build time** for the web Worker (GitHub Actions secret `TURNSTILE_SITE_KEY`, or your local shell when running `pnpm --filter @unsaid/web run build`).
The secret key goes in Workers secrets (Step 5).

---

## Step 5 — Set Workers secrets

Secrets are set via Wrangler and stored encrypted in Cloudflare — never committed to the repo.

```bash
# Turnstile secret key
pnpm --filter @unsaid/api exec wrangler secret put TURNSTILE_SECRET_KEY
# Paste the secret key when prompted
```

Non-sensitive production Worker variables, including `ALLOWED_ORIGINS` and `TURNSTILE_ALLOWED_HOSTNAMES`, live in `apps/api/wrangler.toml` so automated deploys do not depend on dashboard-only config.

---

## Step 6 — Deploy the Workers API

```bash
pnpm deploy:api
```

This applies remote D1 migrations first, then deploys the Worker. If there are no pending migrations, Wrangler exits cleanly and continues.

After deploy, Wrangler will print the Worker URL:

```
https://unsaid-api.<your-subdomain>.workers.dev
```

Keep this URL — you'll need it for `PUBLIC_API_URL` when building the frontend.

> To deploy with a custom domain (e.g., `api.unsaid.santi020k.com`), go to:
> Workers & Pages → unsaid-api → Settings → Triggers → Add custom domain

---

## Step 7 — Deploy the frontend (Astro → Cloudflare Worker)

**Important:** Astro 6 with `@astrojs/cloudflare` v13+ targets [Cloudflare Workers with static assets](https://docs.astro.build/en/guides/deploy/cloudflare/), not legacy **Cloudflare Pages** static hosting. Uploading `apps/web/dist` to Pages (expecting a root `index.html`) produces **404** on `/` because the real app is a Worker (`dist/server/entry.mjs`) plus assets under `dist/client/`.

### Option A: GitHub Actions (default for this repo)

On push to `main`, the `deploy-web` job runs `pnpm turbo run deploy --filter=@unsaid/web` (build, then `wrangler deploy --config dist/server/wrangler.json`). Use the same Cloudflare repository secrets as in the **CI/CD via GitHub Actions** section below (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `TURNSTILE_SITE_KEY`).

### Option B: Cloudflare dashboard — Workers Builds

1. **Workers & Pages** → **Create** → follow **Import a repository** / **Workers Builds** for a Worker (not “Pages” static upload).
2. Monorepo root: build command e.g. `pnpm install --frozen-lockfile && pnpm turbo run build --filter=@unsaid/web`, deploy command `pnpm --filter @unsaid/web exec wrangler deploy --config dist/server/wrangler.json`.
3. Provide build-time env: `PUBLIC_API_URL`, `PUBLIC_TURNSTILE_SITE_KEY`, `NODE_VERSION=22`, `PNPM_VERSION=10.32.1` (match `packageManager`).

See Astro’s [Cloudflare Workers deploy guide](https://docs.astro.build/en/guides/deploy/cloudflare/).

### Option C: Manual Wrangler (local or any CI)

```bash
# From repo root — build then upload the Worker + client assets
PUBLIC_API_URL=https://api.unsaid.santi020k.com \
PUBLIC_TURNSTILE_SITE_KEY=<turnstile-site-key> \
pnpm turbo run deploy --filter=@unsaid/web
```

Or, after a build:

```bash
cd apps/web && pnpm exec wrangler deploy --config dist/server/wrangler.json
```

Worker name is set in `apps/web/wrangler.toml` (`name = "unsaid"`). Custom domains attach to this Worker under **Workers & Pages** → **unsaid** → **Domains & Routes**.

---

## Step 8 — Custom domain

### For the web Worker (frontend)

1. Workers & Pages → **unsaid** (Worker) → **Domains & Routes** → Add custom domain
2. Enter `unsaid.santi020k.com` and `www.unsaid.santi020k.com` (or use the same hostnames your `_redirects` expects)
3. Cloudflare auto-provisions SSL

### For Workers (API)

1. Workers & Pages → unsaid-api → Settings → Triggers → Add custom domain
2. Enter `api.unsaid.santi020k.com`
3. If the frontend domains change, update `ALLOWED_ORIGINS` and `TURNSTILE_ALLOWED_HOSTNAMES` in `apps/api/wrangler.toml`
4. Update `PUBLIC_API_URL` for the next **web** build/CI run to `https://api.unsaid.santi020k.com`

---

## Local development with remote resources

If you want to use local dev but point at production D1/KV (read-only testing):

```bash
pnpm --filter @unsaid/api exec wrangler dev --remote
```

This connects to the real Cloudflare resources but runs the Worker locally.

---

## Local development with local resources

```bash
# First time: apply local D1 migrations
pnpm --filter @unsaid/api run db:migrate

# Create apps/api/.dev.vars with:
# TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
# ALLOWED_ORIGINS=http://localhost:4321

# Start API
pnpm --filter @unsaid/api dev

# In another terminal, start web
pnpm --filter @unsaid/web dev
```

---

## Environment variable reference

### `apps/web` (build-time for the Cloudflare Worker)

These are read when Astro builds (`astro build`), not at Worker runtime:

| Variable | Required | Description |
|---|---|---|
| `PUBLIC_API_URL` | Yes | Full URL of the Workers API |
| `PUBLIC_TURNSTILE_SITE_KEY` | Yes | Turnstile site key (public, safe to expose) |
| `NODE_VERSION` | Recommended | Set to `22` in CI or dashboard; `.node-version` also pins this |
| `PNPM_VERSION` | Recommended | Set to `10.32.1` to match `packageManager` |

### `apps/api` (Cloudflare Workers)

| Variable | How to set | Description |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | `wrangler secret put` | Turnstile secret (never commit) |
| `ALLOWED_ORIGINS` | `wrangler.toml` / `.dev.vars` | Comma-separated permitted CORS origins |
| `TURNSTILE_ALLOWED_HOSTNAMES` | `wrangler.toml` / `.dev.vars` | Comma-separated hostnames accepted from Turnstile verification |
| `ENABLE_AUTO_TRANSLATION` | `wrangler.toml` / `.dev.vars` | Set to `true` only if public post text may be sent to the translation provider |
| `DB` | `wrangler.toml` binding | D1 database binding |
| `RATE_LIMIT` | `wrangler.toml` binding | KV namespace binding |

---

## CI/CD via GitHub Actions

The `.github/workflows/ci.yml` workflow runs on every PR and push to `main`:
- Lint + type-check
- E2E + accessibility tests
- Build (validates the Astro build succeeds)

**The web Worker deploys automatically** on push to `main` after the build and test jobs pass (`deploy-web` job): `pnpm turbo run deploy --filter=@unsaid/web`.

**The Workers API deploys automatically** on push to `main` after the build and test jobs pass (`deploy-api` job):

1. Installs dependencies with the pinned pnpm version.
2. Runs `pnpm --filter @unsaid/api run db:migrate:remote`.
3. Runs `pnpm --filter @unsaid/api run deploy:worker`.

Add these GitHub repository secrets before relying on automated API deploys:

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Lets Wrangler apply D1 migrations and deploy the Worker |
| `CLOUDFLARE_ACCOUNT_ID` | Required by Wrangler in non-interactive CI |
| `CLOUDFLARE_D1_DATABASE_ID` | Injected into `wrangler.toml` during the deploy job |
| `CLOUDFLARE_KV_NAMESPACE_ID` | Injected into `wrangler.toml` during the deploy job |
| `CLOUDFLARE_PREVIEW_KV_NAMESPACE_ID` | Injected into `wrangler.toml` during the deploy job |
| `TURNSTILE_SITE_KEY` | Used by the CI build for the public frontend Turnstile key |

Generate the Cloudflare token at dash.cloudflare.com → My Profile → API Tokens. Start with the "Edit Cloudflare Workers" template and make sure the token can deploy Workers and apply D1 migrations for this account.

---

## Troubleshooting

### 404 on `/` after connecting the repo to Cloudflare

If the project was set up as **Cloudflare Pages** with build output directory `apps/web/dist`, the edge only sees static files under `dist/client/` and no Worker — `/` returns **404**. Remove or disable that Pages project and deploy the frontend with **`wrangler deploy`** (this repo: `pnpm turbo run deploy --filter=@unsaid/web` or the `deploy-web` GitHub Action). Astro 6 + `@astrojs/cloudflare` v13+ does not support legacy Pages static deploy for SSR apps; see the [adapter changelog](https://docs.astro.build/en/guides/integrations-guide/cloudflare/).

### `wrangler.toml` IDs still have placeholder values

```
Error: D1 database "REPLACE_WITH_YOUR_D1_ID" not found
```

For local deploys, follow Steps 1–3 and replace the placeholder IDs in `apps/api/wrangler.toml`. For GitHub Actions deploys, make sure `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`, and `CLOUDFLARE_PREVIEW_KV_NAMESPACE_ID` are set as repository secrets.

### CORS errors in the browser

The API returns `403` or the browser blocks the request. Check:
1. `ALLOWED_ORIGINS` in `apps/api/wrangler.toml` includes the exact site origin you load in the browser (no trailing slash), e.g. `https://unsaid.santi020k.com`
2. `PUBLIC_API_URL` used when **building** the web app points to the correct API Worker URL

### Turnstile always fails in local dev

Use the Turnstile test keys:
- Site key: `1x00000000000000000000AA`
- Secret: `1x0000000000000000000000000000000AA`

These always pass validation and are safe for local/staging.

### D1 table not found

```
no such table: posts
```

Run the D1 migrations (Step 2). Use `pnpm --filter @unsaid/api run db:migrate` for local dev.

### Rate limiter not working locally

Wrangler's local KV is in-memory and resets on restart. This is expected locally. The rate limiter works correctly in production.
