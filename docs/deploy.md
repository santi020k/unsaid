# Cloudflare Deployment Guide

This guide covers deploying Unsaid to Cloudflare from scratch. It assumes you have a Cloudflare account and the repo cloned locally.

Ongoing production deploys should be automated:

- Cloudflare Pages deploys `apps/web` on push to `main` through the Pages Git integration.
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

Copy the `database_id` and replace `REPLACE_WITH_YOUR_D1_ID` in `apps/api/wrangler.toml`.

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

Copy the `id` and replace `REPLACE_WITH_YOUR_KV_ID` in `apps/api/wrangler.toml`.

> Also create a preview namespace for local dev (optional):
> ```bash
> pnpm --filter @unsaid/api exec wrangler kv namespace create RATE_LIMIT --preview
> # Add preview_id to wrangler.toml
> ```

---

## Step 4 — Set up Cloudflare Turnstile

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile**
2. Add a site → select "Managed" challenge type
3. Add your domain (`unsaid.santi020k.com`)
4. Copy the **Site Key** (public) and **Secret Key** (private)

The site key goes in Cloudflare Pages environment variables.
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

Keep this URL — you'll need it for the Pages environment variable.

> To deploy with a custom domain (e.g., `api.unsaid.santi020k.com`), go to:
> Workers & Pages → unsaid-api → Settings → Triggers → Add custom domain

---

## Step 7 — Deploy the frontend via Cloudflare Pages

### Option A: Cloudflare dashboard (recommended for first setup)

1. Go to **Workers & Pages** → **Create** → **Pages**
2. Connect to your Git provider and select the `unsaid` repo
3. Configure build settings:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm turbo run build --filter=@unsaid/web` |
| Build output directory | `apps/web/dist` |
| Root directory | `/` (monorepo root) |

4. Add environment variables (Production):

| Variable | Value |
|---|---|
| `PUBLIC_API_URL` | `https://unsaid-api.<your-subdomain>.workers.dev` |
| `PUBLIC_TURNSTILE_SITE_KEY` | Your Turnstile site key |
| `NODE_VERSION` | `22` |

5. Deploy.

### Option B: Wrangler Pages (CI/CD)

```bash
# Build with production public env
PUBLIC_API_URL=https://api.unsaid.santi020k.com \
PUBLIC_TURNSTILE_SITE_KEY=<turnstile-site-key> \
pnpm --filter @unsaid/web run build

# Deploy
pnpm --filter @unsaid/api exec wrangler pages deploy apps/web/dist --project-name=unsaid
```

Avoid using both Pages Git integration and Wrangler Pages deploys for the same branch unless you intentionally want duplicate deployments.

---

## Step 8 — Custom domain

### For Pages (frontend)

1. Workers & Pages → unsaid → Custom domains → Set up a custom domain
2. Enter `unsaid.santi020k.com` and `www.unsaid.santi020k.com`
3. Cloudflare auto-provisions SSL

### For Workers (API)

1. Workers & Pages → unsaid-api → Settings → Triggers → Add custom domain
2. Enter `api.unsaid.santi020k.com`
3. If the frontend domains change, update `ALLOWED_ORIGINS` and `TURNSTILE_ALLOWED_HOSTNAMES` in `apps/api/wrangler.toml`
4. Update `PUBLIC_API_URL` in Pages env to `https://api.unsaid.santi020k.com`

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

### `apps/web` (Cloudflare Pages)

| Variable | Required | Description |
|---|---|---|
| `PUBLIC_API_URL` | Yes | Full URL of the Workers API |
| `PUBLIC_TURNSTILE_SITE_KEY` | Yes | Turnstile site key (public, safe to expose) |
| `NODE_VERSION` | Yes | Set to `22` for Pages build |

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

**Cloudflare Pages deploys automatically** on push to `main` when the repo is connected via the dashboard.

**Workers API deploys automatically** on push to `main` after the build and test jobs pass. The deploy job:

1. Installs dependencies with the pinned pnpm version.
2. Runs `pnpm --filter @unsaid/api run db:migrate:remote`.
3. Runs `pnpm --filter @unsaid/api run deploy:worker`.

Add these GitHub repository secrets before relying on automated API deploys:

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Lets Wrangler apply D1 migrations and deploy the Worker |
| `CLOUDFLARE_ACCOUNT_ID` | Required by Wrangler in non-interactive CI |
| `TURNSTILE_SITE_KEY` | Used by the CI build for the public frontend Turnstile key |

Generate the Cloudflare token at dash.cloudflare.com → My Profile → API Tokens. Start with the "Edit Cloudflare Workers" template and make sure the token can deploy Workers and apply D1 migrations for this account.

---

## Troubleshooting

### `wrangler.toml` IDs still have placeholder values

```
Error: D1 database "REPLACE_WITH_YOUR_D1_ID" not found
```

Follow Steps 1–3 and replace the placeholder IDs in `apps/api/wrangler.toml`.

### CORS errors in the browser

The API returns `403` or the browser blocks the request. Check:
1. `ALLOWED_ORIGINS` in `apps/api/wrangler.toml` includes the exact Pages URL (no trailing slash)
2. The `PUBLIC_API_URL` in Pages env points to the correct Worker URL

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
