import { expect, test } from '@playwright/test'

const SITE_URL = 'https://unsaid.santi020k.com'

// ── Canonical & hreflang ─────────────────────────────────────────────────────

test('English homepage has correct canonical URL', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/`)
})

test('Spanish homepage has correct canonical URL', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/es/`)
})

test('English homepage has hreflang alternate links for both locales', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${SITE_URL}/`)

  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', `${SITE_URL}/es/`)

  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${SITE_URL}/`)
})

test('Spanish homepage has correct hreflang alternate links', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${SITE_URL}/`)

  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', `${SITE_URL}/es/`)
})

// ── Meta description ─────────────────────────────────────────────────────────

test('English homepage has meta description', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content', 'The things everyone knows. The things nobody says.'
  )
})

test('Spanish homepage has meta description', async ({ page }) => {
  await page.goto('/es/')

  const content = page.locator('meta[name="description"]')

  await expect(content).toHaveAttribute('content')

  expect(content.length).toBeGreaterThan(10)
})

// ── Open Graph ───────────────────────────────────────────────────────────────

test('English homepage has correct Open Graph tags', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Unsaid')

  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}/`)

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${SITE_URL}/banner.png`)

  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
})

test('Spanish homepage has correct Open Graph locale', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'es_ES')

  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}/es/`)
})

// ── Twitter card ─────────────────────────────────────────────────────────────

test('pages have Twitter summary_large_image card', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')

  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${SITE_URL}/banner.png`)
})

// ── JSON-LD structured data ──────────────────────────────────────────────────

test('English homepage has valid WebSite JSON-LD schema', async ({ page }) => {
  await page.goto('/')

  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const schema = JSON.parse(raw ?? '{}') as Record<string, unknown>

  expect(schema['@context']).toBe('https://schema.org')

  expect(schema['@type']).toBe('WebSite')

  expect(schema.name).toBe('Unsaid')

  expect(schema.url).toBe(`${SITE_URL}/`)

  expect(Array.isArray(schema.inLanguage)).toBe(true)

  expect(schema.inLanguage).toContain('en')

  expect(schema.inLanguage).toContain('es')
})

// ── robots meta ──────────────────────────────────────────────────────────────

test('pages are indexable', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
})
