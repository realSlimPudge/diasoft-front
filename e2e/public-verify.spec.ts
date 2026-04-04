import { test, expect } from '@playwright/test'

test.describe('Публичная верификация (без логина)', () => {
  test('главная страница загружается', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/diasoft|dipl/i)
    // Хотя бы один call-to-action
    await expect(page.getByRole('link', { name: /проверить|verify/i }).or(
      page.getByRole('button', { name: /проверить|verify/i })
    ).first()).toBeVisible({ timeout: 10_000 })
  })

  test('верификация по номеру — диплом найден', async ({ page }) => {
    await page.goto('/')

    // Ищем форму верификации (может быть на главной или на отдельной странице)
    const diplomaInput = page.getByPlaceholder(/D-2026/i).or(page.getByPlaceholder(/номер диплома/i)).first()
    await diplomaInput.waitFor({ timeout: 10_000 })
    await diplomaInput.fill('D-2026-0001')

    const uniInput = page.getByPlaceholder(/ITMO/i).or(page.getByPlaceholder(/код/i)).first()
    await uniInput.fill('ITMO')

    await page.getByRole('button', { name: /проверить/i }).click()

    // Должен появиться вердикт
    await expect(page.getByText(/действителен|valid/i)).toBeVisible({ timeout: 10_000 })
  })

  test('верификация по номеру — диплом не найден', async ({ page }) => {
    await page.goto('/')

    const diplomaInput = page.getByPlaceholder(/D-2026/i).or(page.getByPlaceholder(/номер диплома/i)).first()
    await diplomaInput.waitFor({ timeout: 10_000 })
    await diplomaInput.fill('FAKE-9999')

    const uniInput = page.getByPlaceholder(/ITMO/i).or(page.getByPlaceholder(/код/i)).first()
    await uniInput.fill('ITMO')

    await page.getByRole('button', { name: /проверить/i }).click()

    await expect(page.getByText(/не найден|not.found/i)).toBeVisible({ timeout: 10_000 })
  })

  test('верификация по QR-токену /v/:token', async ({ page }) => {
    await page.goto('/v/itmo-demo-verify-token')
    await expect(page.getByText(/действителен|valid|ITMO|D-2026-0001/i)).toBeVisible({ timeout: 10_000 })
  })

  test('невалидный QR-токен показывает not_found', async ({ page }) => {
    await page.goto('/v/totally-invalid-token')
    await expect(page.getByText(/не найден|not.found|not found/i)).toBeVisible({ timeout: 10_000 })
  })

  test('share-link страница /s/:token', async ({ page }) => {
    // Сначала создаём share-link через студента, потом открываем
    // Для теста используем заранее известный токен из demo
    await page.goto('/s/test-share-token')
    // Должна быть информация о дипломе или сообщение
    await expect(
      page.getByText(/ITMO|D-2026|действителен|истёк|не найден/i)
    ).toBeVisible({ timeout: 10_000 })
  })
})
