# Cloudflare Deployment Guide

This guide covers deploying Unsaid to Cloudflare from scratch. It assumes you have a Cloudflare account and the repo cloned locally.

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

## Step 2 — Run the schema migration

```bash
# Production
pnpm --filter @unsaid/api exec wrangler d1 execute unsaid-db --file=schema.sql

# Verify
pnpm --filter @unsaid/api exec wrangler d1 execute unsaid-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

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
3. Add your domain (`unsaid.app`)
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

# Allowed CORS origin (your Pages domain)
pnpm --filter @unsaid/api exec wrangler secret put ALLOWED_ORIGIN
# Enter: https://unsaid.app
```

---

## Step 6 — Deploy the Workers API

```bash
pnpm --filter @unsaid/api exec wrangler deploy
```

After deploy, Wrangler will print the Worker URL:

```
https://unsaid-api.<your-subdomain>.workers.dev
```

Keep this URL — you'll need it for the Pages environment variable.

> To deploy with a custom domain (e.g., `api.unsaid.app`), go to:
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
# Build first
pnpm --filter @unsaid/web run build

# Deploy
pnpm --filter @unsaid/api exec wrangler pages deploy apps/web/dist --project-name=unsaid
```

---

## Step 8 — Custom domain

### For Pages (frontend)

1. Workers & Pages → unsaid → Custom domains → Set up a custom domain
2. Enter `unsaid.app` and `www.unsaid.app`
3. Cloudflare auto-provisions SSL

### For Workers (API)

1. Workers & Pages → unsaid-api → Settings → Triggers → Add custom domain
2. Enter `api.unsaid.app`
3. Update `ALLOWED_ORIGIN` secret to `https://unsaid.app`
4. Update `PUBLIC_API_URL` in Pages env to `https://api.unsaid.app`

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
# First time: seed local D1
pnpm --filter @unsaid/api exec wrangler d1 execute unsaid-db --local --file=schema.sql

# Create apps/api/.dev.vars with:
# TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
# ALLOWED_ORIGIN=http://localhost:4321

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
| `ALLOWED_ORIGIN` | `wrangler secret put` | Permitted CORS origin |
| `DB` | `wrangler.toml` binding | D1 database binding |
| `RATE_LIMIT` | `wrangler.toml` binding | KV namespace binding |

---

## CI/CD via GitHub Actions

The `.github/workflows/ci.yml` workflow runs on every PR and push to `main`:
- Lint + type-check
- Build (validates the Astro build succeeds)

**Cloudflare Pages deploys automatically** on push to `main` when the repo is connected via the dashboard.

**Workers do not auto-deploy via CI** in the current setup. To add auto-deploy:

```yaml
# Add to ci.yml after the build job
deploy-api:
  needs: build
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
      with:
        version: 10.32.1
    - uses: actions/setup-node@v4
      with:
        node-version-file: .node-version
        cache: pnpm
    - run: pnpm install --frozen-lockfile
    - run: pnpm --filter @unsaid/api exec wrangler deploy
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Add `CLOUDFLARE_API_TOKEN` to your GitHub repository secrets. Generate the token at:
dash.cloudflare.com → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template.

---

## Troubleshooting

### `wrangler.toml` IDs still have placeholder values

```
Error: D1 database "REPLACE_WITH_YOUR_D1_ID" not found
```

Follow Steps 1–3 and replace the placeholder IDs in `apps/api/wrangler.toml`.

### CORS errors in the browser

The API returns `403` or the browser blocks the request. Check:
1. `ALLOWED_ORIGIN` secret matches the exact Pages URL (no trailing slash)
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

Run the schema migration (Step 2). Don't forget `--local` for local dev.

### Rate limiter not working locally

Wrangler's local KV is in-memory and resets on restart. This is expected locally. The rate limiter works correctly in production.
