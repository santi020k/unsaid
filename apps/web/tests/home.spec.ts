import { expectNoUnexpectedAccessibilityViolations } from './helpers/accessibility'

import type { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const axeForPage = (builder: AxeBuilder) => builder.exclude('.cf-turnstile')

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

test('homepage exposes skip link to main content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content')
})

test('Spanish homepage exposes skip link to main content', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toHaveAttribute('href', '#main-content')
})

test('English homepage has no unexpected accessibility violations', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('#main-content')).toBeVisible()

  await expectNoUnexpectedAccessibilityViolations(page, [], axeForPage)
})

test('Spanish homepage has no unexpected accessibility violations', async ({ page }) => {
  await page.goto('/es/')

  await expect(page.locator('#main-content')).toBeVisible()

  await expectNoUnexpectedAccessibilityViolations(page, [], axeForPage)
})
