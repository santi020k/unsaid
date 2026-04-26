import { expect, test } from '@playwright/test'

// ── Skip links ──────────────────────────────────────────────────────────────

test('English page exposes skip link to main content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Skip to main content' }))
    .toHaveAttribute('href', '#main-content')
})

test('Spanish page exposes skip link to main content', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.getByRole('link', { name: 'Saltar al contenido principal' }))
    .toHaveAttribute('href', '#main-content')
})

// ── Language switcher ────────────────────────────────────────────────────────

test('language switcher navigates from English to Spanish', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Español' }).click()

  await expect(page).toHaveURL('/es/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Las cosas que todos saben')
})

test('language switcher navigates from Spanish to English', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('navigation', { name: 'Sitio' }).getByRole('link', { name: 'English' }).click()

  await expect(page).toHaveURL('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('The things everyone knows')
})

test('language switcher on privacy page preserves the legal section', async ({ page }) => {
  await page.goto('/privacy')

  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Español' }).click()

  await expect(page).toHaveURL('/es/privacy')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Política de privacidad')
})

// ── Logo / brand link ────────────────────────────────────────────────────────

test('logo link returns to English home from a legal page', async ({ page }) => {
  await page.goto('/privacy')

  await page.getByRole('link', { name: 'Unsaid' }).click()

  await expect(page).toHaveURL('/')
})

test('logo link stays at Spanish home when on Spanish page', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('link', { name: 'Unsaid' }).click()

  await expect(page).toHaveURL('/es/')
})

// ── Footer legal nav ─────────────────────────────────────────────────────────

test('English footer privacy link navigates to privacy page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('navigation', { name: 'Legal' }).getByRole('link', { name: 'Privacy' }).click()

  await expect(page).toHaveURL(/\/privacy/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy policy')
})

test('English footer terms link navigates to terms page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('navigation', { name: 'Legal' }).getByRole('link', { name: 'Terms of use' }).click()

  await expect(page).toHaveURL(/\/terms/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms of use')
})

test('Spanish footer privacy link navigates to Spanish privacy page', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('navigation', { name: 'Información legal' }).getByRole('link', { name: 'Privacidad' }).click()

  await expect(page).toHaveURL(/\/es\/privacy/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Política de privacidad')
})

test('Spanish footer terms link navigates to Spanish terms page', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('navigation', { name: 'Información legal' }).getByRole('link', { name: 'Términos de uso' }).click()

  await expect(page).toHaveURL(/\/es\/terms/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Términos de uso')
})
