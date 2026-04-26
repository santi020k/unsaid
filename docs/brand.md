# Unsaid — Brand Guidelines

> This document is the single source of truth for the Unsaid visual identity and tone of voice. Reference it when building new features, designing new pages, or generating assets.

---

## Brand essence

**Unsaid** lives in the gap between what people think and what they actually say out loud.

The platform exists for the uncomfortable, the obvious, the overlooked — truths that are fundamentally real but socially inconvenient to voice. It is anonymous by design, not as a gimmick, but as the only way to make that honesty possible.

The brand should feel like:
- A note slipped under a door at 2am
- A thought you had in the shower that you knew was true but never said
- Confrontational, but not cruel
- Sharp, but not cold

---

## Naming

| | |
|---|---|
| **Product name** | Unsaid |
| **Capitalization** | Always "Unsaid" — never "UNSAID" or "unsaid" in copy |
| **Taglines** | "The things everyone knows. The things nobody says." |
| | "Anonymous. Always." |
| | "No filter. No name. Just truth." |
| **Domain** | unsaid.app |

---

## Color system

All colors are defined as CSS custom properties in `apps/web/src/styles/partials/tokens.css` and available as Tailwind utility classes.

### Palette

| Role | Token | Hex | Usage |
|---|---|---|---|
| Page background | `bg-void` | `#0b0b0b` | The void. Every page background. |
| Card / form surface | `bg-surface` | `#151515` | Cards, modals, inputs |
| Raised surface | `bg-surface-raised` | `#1a1a1a` | Dropdowns, hover backgrounds |
| Border | `border-border` | `#1f1f1f` | Dividers, card outlines |
| Subtle border | `border-border-subtle` | `#181818` | Hairline separators |
| Primary text | `text-text-primary` | `#f2ede6` | Body text, headings — warm off-white |
| Secondary text | `text-text-muted` | `#6b7380` | Labels, metadata, placeholder |
| Faint text | `text-text-faint` | `#3a3e45` | Placeholders, char counters |
| **Brand accent** | `text-accent` | `#e8e000` | Electric yellow — CTAs, dots, highlights |
| Accent hover | `text-accent-dim` | `#b3ae00` | Hover state of accent elements |
| Accent glow | — | `rgba(232,224,0,0.12)` | Box-shadow on hover cards |
| Error / danger | `text-danger` | `#ff4455` | Form errors, rate limit messages |
| Success | `text-success` | `#00e676` | Confirmation states |

### Color principles

- **Never pure white.** Primary text is `#f2ede6` — warm, slightly aged. Pure white feels clinical.
- **Never pure black.** Background is `#0b0b0b` — a void, not a wall.
- **Accent is confrontational.** Electric yellow on near-black is highway sign energy. It should command attention, not comfort.
- **High contrast always.** Every text/background combination must pass WCAG AA (4.5:1 for body, 3:1 for large).
- **No gradients on text.** Gradients are reserved for decorative backgrounds only.

---

## Typography

### Typefaces

| Role | Family | Weights | Source |
|---|---|---|---|
| **Display** | [Syne](https://fonts.google.com/specimen/Syne) | 700, 800 | Google Fonts |
| **Body / UI** | [Geist](https://vercel.com/font) | 400, 500 | CDN (jsdelivr) |
| **Post text / Mono** | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | 400, 500 | Google Fonts |

### Usage

| Context | Font | Weight | Class |
|---|---|---|---|
| Hero headline | Syne | 800 | `heading-display text-5xl` |
| Section titles | Syne | 700 | `heading-display text-2xl` |
| Navigation logo | Syne | 700 | `heading-display text-lg` |
| Body / UI text | Geist | 400 | (default `font-sans`) |
| Labels / metadata | Geist | 600 | `text-label` |
| Post content | JetBrains Mono | 400 | `font-mono text-sm` |
| Char counter / timestamps | JetBrains Mono | 400 | `text-xs font-mono` |

### Typography principles

- **Post text is always monospace.** Every truth feels typed — raw, unedited, directly from thought to screen.
- **Display type is wide and confrontational.** Syne at large sizes has a slightly unsettling geometry. Use it.
- **No italic.** Italics soften. This brand does not soften.
- **Short line lengths for posts.** Max `max-w-2xl` (672px). Truth is a whisper, not a wall of text.

---

## Voice and tone

### Principles

| Principle | In practice |
|---|---|
| **Direct** | "Share a truth" not "Share your story with the world" |
| **Economical** | One sentence where three would do. Cut the second and third. |
| **Declarative** | Statements, not questions. "Anonymous. Always." not "Are you anonymous?" |
| **No exclamation marks** | Ever. They betray the seriousness of the content. |
| **Honest about limits** | Error messages tell the truth: "Daily limit reached. Come back tomorrow." not "You've exceeded your quota." |
| **No corporate language** | "No bullshit." is in the footer. Mean it. |

### Vocabulary to use

- truth / truths
- anonymous / anonymously
- publish / share
- say it
- unfiltered
- real
- come back tomorrow

### Vocabulary to avoid

- story / stories (too narrative, too soft)
- community / users / members (too social platform)
- privacy-first / privacy-protected (too compliance-y)
- content (too corporate)
- post (technically correct but "truth" is always preferred in copy)

### Error message examples

| Situation | Copy |
|---|---|
| Rate limit hit | "Daily limit reached. Come back tomorrow." |
| CAPTCHA failed | "CAPTCHA failed. Please try again." |
| Too short | "Too short. Say a bit more." |
| Too long | "Too long. Keep it tight." |
| Generic server error | "Something went wrong. Try again." |
| Empty feed | "No truths yet. Be the first." |

---

## UI / UX principles

### Layout

- **Single column, centered, constrained width.** Max `48rem` (768px) for content. Narrower for posts (`max-w-2xl` = 42rem).
- **Generous vertical rhythm.** Section padding `py-16`. Don't compress space — the emptiness is intentional.
- **No sidebars.** Ever. The focus is the feed.

### Components

#### Cards (truths)

- Background: `bg-surface` (`#151515`)
- Border: `1px solid` `border-border` (`#1f1f1f`)
- Border-radius: `0.5rem`
- Hover: border brightens to `accent/25`, subtle yellow box-shadow glow
- Post text: monospace, `text-sm`, warm white
- Timestamp: monospace, `text-xs`, faint gray
- Accent dot: `1.5px × 1.5px` yellow circle (`accent-dot` utility) — the only color in the card

#### Buttons

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary (`btn-primary`) | `#e8e000` (accent) | `#0b0b0b` (void) | none |
| Ghost (`btn-ghost`) | transparent | muted | `border-border` |

- Shape: fully rounded pill (`border-radius: 9999px`)
- No shadows on buttons
- Hover: primary dims to `accent-dim`, ghost brightens border
- Transitions: 150ms — fast, sharp, not luxurious

#### Form

- Textarea uses `JetBrains Mono` — the user types their truth, it should feel like they're typing, not filling out a form
- Character counter bottom-right, counts down from 280
- Submit button right-aligned, below Turnstile widget
- Error messages appear inline, left of the button

### Animations

- **Entrance:** `slide-up` (16px Y, 0.5s ease-out) for headlines. `fade-in` (0.4s) for eyebrow labels.
- **Scroll reveal:** `[data-animate]` elements fade+slide up when entering viewport.
- **Feed updates:** New posts prepend with an `accent-pulse` glow (1.6s, one-shot).
- **Transitions:** `150ms` for interactive states (hover, focus). Never more than `200ms` for UI chrome.
- **Always respect `prefers-reduced-motion`.** The `[data-animate]` system only activates when `no-preference`.

### Spacing scale (relevant values)

- Card padding: `1.5rem` (p-6)
- Section vertical: `4rem` (py-16)
- Hero top: `6rem` (pt-24)
- Gap between feed items: `1rem` (gap-4)
- Nav height: ~`56px` (py-4 + content)

---

## Accessibility

- **WCAG AA minimum.** All text must meet 4.5:1 contrast against its background.
- **Skip link.** Present in every page via `BaseLayout`. Focuses `#main-content`.
- **Focus visible.** All interactive elements have a `2px solid accent` outline on focus.
- **ARIA.** Form has `aria-describedby` linking to char counter and status message. Feed section has `aria-label`.
- **Live regions.** `aria-live="polite"` on form status and char counter.
- **No color alone.** Errors use text labels, not just red color.

---

## Assets and iconography

- **No icon library** at launch. Use inline SVG or text-based indicators (accent dot, typographic arrows).
- **No illustrations.** The typography is the visual. White space is the design.
- **Favicon:** A yellow dot on a void background — the `accent-dot` concept at favicon scale.
- **OG image:** When implemented — dark card with the Unsaid wordmark in Syne 800, tagline in Geist, yellow accent dot. No gradients.

---

## What this brand is NOT

- Not a confessional app (Whisper, Secret) — those are about personal secrets. Unsaid is about shared, universal truths.
- Not a debate platform — there are no comments, no reactions, no up/down votes.
- Not minimalist for aesthetic reasons — minimalism here serves anonymity. Less UI means less identity.
- Not aggressive or edgy for shock value — the truths should be uncomfortable because they're *true*, not because they're controversial.
