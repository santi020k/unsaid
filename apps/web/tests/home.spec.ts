import { expect, test } from '@playwright/test'

test('English homepage has correct title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Unsaid')
})

test('Spanish homepage has correct title', async ({ page }) => {
  await page.goto('/es/')

  await expect(page).toHaveTitle('Unsaid')
})

test('English homepage renders hero section', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('The things everyone knows')

  await expect(page.getByText('Anonymous. Always.')).toBeVisible()

  await expect(page.getByText('No names. No filters. Just truth.')).toBeVisible()
})

test('Spanish homepage renders hero section', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Las cosas que todos saben')

  await expect(page.getByText('Anónimo. Siempre.')).toBeVisible()

  await expect(page.getByText('Sin nombres. Sin filtros. Solo verdad.')).toBeVisible()
})

test('English homepage renders post form', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('region', { name: 'Say it.' })).toBeVisible()

  await expect(page.getByRole('textbox', { name: 'Say it.' })).toBeVisible()

  await expect(page.getByRole('button', { name: 'Publish anonymously' })).toBeVisible()
})

test('Spanish homepage renders post form', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.getByRole('region', { name: 'Dilo.' })).toBeVisible()

  await expect(page.getByRole('textbox', { name: 'Dilo.' })).toBeVisible()

  await expect(page.getByRole('button', { name: 'Publicar anónimamente' })).toBeVisible()
})

test('English homepage renders feed section', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('region', { name: 'Recent truths' })).toBeVisible()
})

test('Spanish homepage renders feed section', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.getByRole('region', { name: 'Verdades recientes' })).toBeVisible()
})

test('English privacy page renders with correct title', async ({ page }) => {
  await page.goto('/privacy')

  await expect(page).toHaveTitle(/Privacy policy.*Unsaid/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy policy')
})

test('Spanish privacy page renders with correct title', async ({ page }) => {
  await page.goto('/es/privacy')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Política de privacidad')
})

test('English terms page renders with correct title', async ({ page }) => {
  await page.goto('/terms')

  await expect(page).toHaveTitle(/Terms.*Unsaid/)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms of use')
})

test('Spanish terms page renders with correct title', async ({ page }) => {
  await page.goto('/es/terms')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Términos de uso')
})
