import { expectNoUnexpectedAccessibilityViolations } from './helpers/accessibility'

import type { AxeBuilder } from '@axe-core/playwright'
import { test } from '@playwright/test'

const withoutTurnstile = (builder: AxeBuilder) => builder.exclude('.cf-turnstile')

// ── Homepages ────────────────────────────────────────────────────────────────

test('English homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page, [], withoutTurnstile)
})

test('Spanish homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/es/')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page, [], withoutTurnstile)
})

// ── Legal pages ──────────────────────────────────────────────────────────────

test('English privacy page has no accessibility violations', async ({ page }) => {
  await page.goto('/privacy')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page)
})

test('Spanish privacy page has no accessibility violations', async ({ page }) => {
  await page.goto('/es/privacy')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page)
})

test('English terms page has no accessibility violations', async ({ page }) => {
  await page.goto('/terms')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page)
})

test('Spanish terms page has no accessibility violations', async ({ page }) => {
  await page.goto('/es/terms')

  await page.locator('#main-content').waitFor({ state: 'visible' })

  await expectNoUnexpectedAccessibilityViolations(page)
})
