import { expect, test } from '@playwright/test'

const MAX_LEN = 280
const MIN_LEN = 10
const belowMin = 'a'.repeat(MIN_LEN - 1)

// ── Form structure ───────────────────────────────────────────────────────────

test('English form has an accessible textarea linked to its heading', async ({ page }) => {
  await page.goto('/')

  const textarea = page.getByRole('textbox', { name: 'Say it.' })

  await expect(textarea).toBeVisible()

  await expect(textarea).toHaveAttribute('aria-labelledby', 'form-heading')
})

test('Spanish form has an accessible textarea linked to its heading', async ({ page }) => {
  await page.goto('/es/')

  const textarea = page.getByRole('textbox', { name: 'Dilo.' })

  await expect(textarea).toBeVisible()

  await expect(textarea).toHaveAttribute('aria-labelledby', 'form-heading')
})

test('form textarea has required and maxlength attributes', async ({ page }) => {
  await page.goto('/')

  const textarea = page.getByRole('textbox', { name: 'Say it.' })

  await expect(textarea).toHaveAttribute('required', '')

  await expect(textarea).toHaveAttribute('maxlength', String(MAX_LEN))
})

// ── Character count ──────────────────────────────────────────────────────────

test('English character count shows remaining characters on load', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('#char-count')).toContainText(String(MAX_LEN))
})

test('Spanish character count shows remaining characters on load', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.locator('#char-count')).toContainText(String(MAX_LEN))
})

test('character count decrements as the user types', async ({ page }) => {
  await page.goto('/')

  const input = 'Hello, world!'

  await page.getByRole('textbox', { name: 'Say it.' }).fill(input)

  await expect(page.locator('#char-count')).toContainText(String(MAX_LEN - input.length))
})

// ── Validation ───────────────────────────────────────────────────────────────

test('submitting content shorter than minimum shows English error', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('textbox', { name: 'Say it.' }).fill(belowMin)

  await page.getByRole('button', { name: 'Publish anonymously' }).click()

  await expect(page.locator('#form-status')).toContainText('Too short')
})

test('submitting content shorter than minimum shows Spanish error', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('textbox', { name: 'Dilo.' }).fill(belowMin)

  await page.getByRole('button', { name: 'Publicar anónimamente' }).click()

  await expect(page.locator('#form-status')).toContainText('Muy corto')
})

test('submitting content exceeding maximum shows English error', async ({ page }) => {
  await page.goto('/')

  const overLimit = 'a'.repeat(MAX_LEN + 1)
  const textarea = page.getByRole('textbox', { name: 'Say it.' })

  await textarea.fill(overLimit)

  // Browsers enforce maxlength on input events but fill() bypasses it —
  // remove the attribute so the JS validation path is exercised.
  await textarea.evaluate((el: HTMLTextAreaElement, len) => {
    el.removeAttribute('maxlength')

    el.value = 'a'.repeat(len + 1)
  }, MAX_LEN)

  await page.getByRole('button', { name: 'Publish anonymously' }).click()

  await expect(page.locator('#form-status')).toContainText('Too long')
})

test('form status is not visible before interaction', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('#form-status')).toBeHidden()
})
