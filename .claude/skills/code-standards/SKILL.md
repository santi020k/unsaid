---
name: code-standards
description: Review and enforce the Unsaid project's ESLint rules and code conventions before finishing any code change
user-invocable: true
---

# Code Standards — Unsaid

Run this skill before reporting any code change as done. Its job is to verify the change passes every automated check and adheres to every convention that the linter cannot catch.

---

## Step 1 — Run the linters

From the repo root:

```bash
pnpm lint        # ESLint all workspaces
pnpm check       # TypeScript type-check all workspaces
```

Fix **every** error and warning before continuing. Do not suppress rules with `// eslint-disable` unless the specific rule is already disabled in the workspace's `eslint.config.js` for a documented reason.

---

## Step 2 — Formatting rules (enforced by `@stylistic/eslint-plugin`)

These are auto-fixable via `pnpm lint --fix`. Always fix rather than hand-edit:

| Rule | Setting |
|---|---|
| Indentation | 2 spaces |
| Quotes | Single (`'`) |
| Semicolons | None |
| Trailing commas | None |
| Object curly spacing | Always (`{ a: 1 }`) |
| Arrow parens | Only when needed (`x => x`, not `(x) => x`) |
| Max line length | 120 chars (comments up to 200) |
| Brace style | 1tbs |
| Blank lines between statements | Always between different statement types; never between consecutive single-line `const`/`let`/`var` |

---

## Step 3 — Import conventions (`simple-import-sort`, `unused-imports`)

- Imports are sorted in this group order: components → ui → atoms → molecules → organisms → templates → pages → store → api → contexts → hooks → lib → services → models → utils → ws → npm packages → side-effects → relative (same/child) → relative (parent) → style files.
- Remove all unused imports. The `unused-imports/no-unused-imports` rule flags them as warnings — treat them as errors.
- Use `import type { Foo }` for type-only imports (`@typescript-eslint/consistent-type-imports`).
- All relative imports on `.ts`/`.astro` source files must use `.js` extension (ESM interop requirement, not enforced by ESLint but enforced at build time).

---

## Step 4 — TypeScript rules (`@typescript-eslint`)

| Rule | Level | Action |
|---|---|---|
| `no-explicit-any` | warn | Use a specific type or `unknown` + type guard |
| `no-floating-promises` | error | Always `await` or explicitly `.catch()` |
| `no-misused-promises` | error | Don't pass async functions where sync is expected |
| `await-thenable` | error | Only `await` actual Promises |
| `no-unsafe-assignment/call/return/argument` | warn | Avoid untyped boundaries |
| `no-non-null-assertion` | warn | Use a null check instead of `!` |
| `no-unused-vars` | warn | Prefix with `_` to suppress if intentional |
| `consistent-type-imports` | warn | Auto-fixed; use inline `import type` style |
| `require-await` | warn | Remove `async` if no `await` inside |

Never use `@ts-ignore` or `@ts-expect-error` without a comment explaining why.

---

## Step 5 — Project-specific conventions (not caught by ESLint)

### General

- ESM only — `.js` extension on all relative imports, even for `.ts` source files.
- No `any`. If the linter warns, use a proper type or `unknown` + type guard.
- No barrel re-exports outside `packages/shared`.

### Astro components

```astro
---
interface Props {
  locale: SupportedLocale
}
const { locale } = Astro.props
const t = useTranslations(locale)
---
<div class:list={['base-class', condition && 'extra']}></div>
```

- Every component with user-visible text must accept a `locale` prop.
- Every new string must be added to **both** `en` and `es` in `apps/web/src/i18n/ui.ts`.
- Decorative SVGs/icons → `aria-hidden="true"`.
- Animations → `motion-reduce:` variant or `@media (prefers-reduced-motion)` fallback.

### Tailwind / CSS

- Repeating patterns → `@utility` block in `utilities.css`, not inline Tailwind classes.
- Colors → `@theme` tokens only (`text-accent`, `bg-void`, etc.) — no hex literals.
- No Tailwind v3 syntax. Use `@theme`, `@utility`, `@plugin` (v4 only).

### Hono / API

- Middleware order: `validateTurnstile → rateLimiter → zValidator → handler`. Never reorder.
- D1 queries via `.prepare().bind().all/first()` — never string interpolation.
- Success shape: `{ data: T }`. Error shape: `{ error: string }`.

### i18n

- Use `useTranslations(locale)` — never access `ui` directly in components.
- New locales: update `SITE.locales`, `astro.config.ts`, create page dir, add `ui.ts` entries.

---

## Step 6 — Security checklist (any API or data-handling change)

- No IP addresses stored in D1.
- No authentication added.
- CAPTCHA validation (`validateTurnstile`) always runs before any write handler.
- No secrets committed — use `wrangler secret put` (prod) or `.dev.vars` (local).
- No string interpolation in D1 queries.

---

## Completion gate

Do **not** mark a task done until:
1. `pnpm lint` exits with zero errors (warnings are OK only if pre-existing).
2. `pnpm check` exits with no TypeScript errors.
3. Every project-specific convention above has been manually verified for the changed files.
