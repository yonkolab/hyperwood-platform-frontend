import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function login(page: Page) {
  const email = process.env.E2E_USER_EMAIL
  const password = process.env.E2E_USER_PASSWORD

  test.skip(
    !email || !password,
    'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run auth smoke tests.',
  )

  await page.goto('/login')
  await page.getByLabel(/e-mail/i).fill(email!)
  await page.getByLabel('Senha').fill(password!)
  await page.getByRole('button', { name: /entrar/i }).click()
}

test('homepage renders trader shell', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Hyperwood' })).toBeVisible()
  await expect(page.getByRole('link', { name: /entrar/i })).toBeVisible()
})

test('auth routes render login and register forms', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByLabel(/e-mail/i)).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()

  await page.goto('/register')
  await expect(page.getByLabel(/e-mail/i)).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
})

test('market detail route loads for a configured market id', async ({ page }) => {
  const marketId = process.env.E2E_MARKET_ID

  test.skip(!marketId, 'Set E2E_MARKET_ID to run the market detail smoke test.')

  await page.goto(`/markets/${marketId}`)
  await expect(page.getByText(/boleta/i)).toBeVisible()
})

test('authenticated trader can reach portfolio and wallet pages', async ({ page }) => {
  await login(page)

  await page.goto('/portfolio')
  await expect(page.getByText(/posições abertas/i)).toBeVisible()

  await page.goto('/wallet')
  await expect(page.getByText(/criar depósito/i)).toBeVisible()
})
