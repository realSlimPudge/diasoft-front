import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('HR-портал', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await loginAs(page, 'hr')
    await expect(page).toHaveURL(/\/hr/, { timeout: 10_000 })
  })

  test('страница HR загружается', async ({ page }) => {
    await expect(page.getByText(/проверка кандидатов/i)).toBeVisible()
    await expect(page.getByText(/по номеру/i)).toBeVisible()
    await expect(page.getByText(/qr-код/i)).toBeVisible()
  })

  test('верификация по номеру диплома — найден', async ({ page }) => {
    await expect(page.getByPlaceholder('D-2026-0001')).toBeVisible({ timeout: 5_000 })
    await page.getByPlaceholder('D-2026-0001').fill('D-2026-0001')
    await page.getByPlaceholder(/ITMO/i).fill('ITMO')
    await page.getByRole('button', { name: /проверить/i }).click()
    await expect(page.getByText(/действителен|valid/i)).toBeVisible({ timeout: 10_000 })
  })

  test('верификация по номеру диплома — не найден', async ({ page }) => {
    await expect(page.getByPlaceholder('D-2026-0001')).toBeVisible({ timeout: 5_000 })
    await page.getByPlaceholder('D-2026-0001').fill('FAKE-0000')
    await page.getByPlaceholder(/ITMO/i).fill('ITMO')
    await page.getByRole('button', { name: /проверить/i }).click()
    await expect(page.getByText(/не найден|not.found/i)).toBeVisible({ timeout: 10_000 })
  })

  test('кнопка верификации задизейблена без данных', async ({ page }) => {
    await expect(page.getByPlaceholder('D-2026-0001')).toBeVisible({ timeout: 5_000 })
    const btn = page.getByRole('button', { name: /проверить/i })
    await expect(btn).toBeDisabled()
  })

  test('вкладка QR-сканера открывается', async ({ page }) => {
    await page.getByText(/qr-код/i).click()
    await expect(page.getByText(/сканирование qr/i)).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: /запустить камеру/i })).toBeVisible()
  })

  test('результат верификации содержит информацию о дипломе', async ({ page }) => {
    await expect(page.getByPlaceholder('D-2026-0001')).toBeVisible({ timeout: 5_000 })
    await page.getByPlaceholder('D-2026-0001').fill('D-2026-0001')
    await page.getByPlaceholder(/ITMO/i).fill('ITMO')
    await page.getByRole('button', { name: /проверить/i }).click()

    await expect(page.getByText(/действителен/i)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/ITMO/i)).toBeVisible()
    await expect(page.getByText(/software engineering/i)).toBeVisible()
  })

  test('повторная верификация очищает предыдущий результат', async ({ page }) => {
    await expect(page.getByPlaceholder('D-2026-0001')).toBeVisible({ timeout: 5_000 })

    // Первая проверка
    await page.getByPlaceholder('D-2026-0001').fill('D-2026-0001')
    await page.getByPlaceholder(/ITMO/i).fill('ITMO')
    await page.getByRole('button', { name: /проверить/i }).click()
    await expect(page.getByText(/действителен/i)).toBeVisible({ timeout: 10_000 })

    // Вторая проверка — несуществующий
    await page.getByPlaceholder('D-2026-0001').fill('FAKE-0000')
    await page.getByRole('button', { name: /проверить/i }).click()
    await expect(page.getByText(/не найден/i)).toBeVisible({ timeout: 10_000 })
  })
})
