import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Кабинет студента', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await loginAs(page, 'student')
    await expect(page).toHaveURL(/\/student/, { timeout: 10_000 })
  })

  test('страница студента загружается с дипломом', async ({ page }) => {
    await expect(page.getByText(/мой диплом/i)).toBeVisible()
    // Ждём загрузки диплома
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
  })

  test('отображается QR-код', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    // QR рендерится как SVG
    await expect(page.locator('svg#diploma-qr-svg')).toBeVisible()
  })

  test('отображаются данные диплома', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('ITMO')).toBeVisible()
    await expect(page.getByText(/software engineering/i)).toBeVisible()
    await expect(page.getByText('2026')).toBeVisible()
  })

  test('отображается блок создания share-link', async ({ page }) => {
    await expect(page.getByText(/поделиться с работодателем/i)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('1ч')).toBeVisible()
    await expect(page.getByText('24ч')).toBeVisible()
    await expect(page.getByText('7д')).toBeVisible()
    await expect(page.getByText('30д')).toBeVisible()
  })

  test('создание share-link — ссылка появляется', async ({ page }) => {
    await page.getByText('24ч').click()
    await page.getByRole('button', { name: /создать ссылку/i }).click()

    // Ждём появления share URL
    await expect(page.getByText(/\/s\//)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('button', { name: /скопировать/i })).toBeVisible()
  })

  test('создание share-link на 1 час', async ({ page }) => {
    await page.getByText('1ч').click()
    await page.getByRole('button', { name: /создать ссылку/i }).click()
    await expect(page.getByText(/\/s\//)).toBeVisible({ timeout: 10_000 })
  })

  test('кнопка скопировать работает', async ({ page }) => {
    await page.getByRole('button', { name: /создать ссылку/i }).click()
    await expect(page.getByText(/\/s\//)).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: /скопировать/i }).click()
    await expect(page.getByText(/скопировано/i)).toBeVisible({ timeout: 5_000 })
  })

  test('отзыв share-link убирает ссылку', async ({ page }) => {
    await page.getByRole('button', { name: /создать ссылку/i }).click()
    await expect(page.getByText(/\/s\//)).toBeVisible({ timeout: 10_000 })

    // Кнопка с иконкой корзины
    await page.locator('button').filter({ has: page.locator('[data-lucide="trash-2"]') }).click()

    // Ссылка исчезает, форма возвращается
    await expect(page.getByRole('button', { name: /создать ссылку/i })).toBeVisible({ timeout: 10_000 })
  })

  test('скачивание QR', async ({ page }) => {
    await expect(page.locator('svg#diploma-qr-svg')).toBeVisible({ timeout: 10_000 })
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /скачать qr/i }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.svg$/)
  })
})
