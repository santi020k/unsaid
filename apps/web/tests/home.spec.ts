import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('English homepage renders hero and form', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Unsaid')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('The things everyone knows')

  await expect(page.getByRole('region', { name: 'Say it.' })).toBeVisible()

  await expect(page.getByRole('textbox', { name: 'Say it.' })).toBeVisible()
})

test('Spanish homepage renders hero and form', async ({ page }) => {
  await page.goto('/es/')

  await expect(page).toHaveTitle('Unsaid')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Las cosas que todos saben')

  await expect(page.getByRole('region', { name: 'Dilo.' })).toBeVisible()

  await expect(page.getByRole('textbox', { name: 'Dilo.' })).toBeVisible()
})

test('language switcher navigates from English to Spanish', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Español' }).click()

  await expect(page).toHaveURL('/es/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Las cosas que todos saben')
})

test('language switcher navigates from Spanish to English', async ({ page }) => {
  await page.goto('/es/')

  await page.getByRole('link', { name: 'English' }).click()

  await expect(page).toHaveURL('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('The things everyone knows')
})

test('English homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .exclude('.cf-turnstile') // third-party widget — audited by Cloudflare
    .analyze()

  expect(results.violations).toEqual([])
})

test('Spanish homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/es/')

  const results = await new AxeBuilder({ page })
    .exclude('.cf-turnstile')
    .analyze()

  expect(results.violations).toEqual([])
})
