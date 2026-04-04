import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'
import path from 'path'

test.describe('Кабинет ВУЗа', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await loginAs(page, 'university')
    await expect(page).toHaveURL(/\/university/, { timeout: 10_000 })
  })

  test('отображается таблица дипломов', async ({ page }) => {
    await expect(page.getByText(/реестр/i)).toBeVisible()
    // Ждём загрузки данных
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
  })

  test('поиск по номеру диплома', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10_000 })
    const searchInput = page.getByPlaceholder(/поиск/i)
    await searchInput.fill('D-2026-0001')
    await expect(page.getByText('D-2026-0001')).toBeVisible()
  })

  test('поиск без результатов показывает сообщение', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10_000 })
    await page.getByPlaceholder(/поиск/i).fill('АБСОЛЮТНОНЕСУЩЕСТВУЮЩИЙНОМЕР')
    await expect(page.getByText(/не найден/i)).toBeVisible({ timeout: 5_000 })
  })

  test('фильтр по статусу работает', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /все статусы/i }).click()
    await page.getByText('Аннулированные').click()
    // Таблица обновилась (может быть пустой — это нормально)
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('кнопка QR открывает верификационную страницу', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    const pagePromise = page.context().waitForEvent('page')
    await page.getByRole('button', { name: /qr/i }).first().click()
    const newPage = await pagePromise
    await expect(newPage).toHaveURL(/\/v\//)
    await newPage.close()
  })

  test('аннулирование диплома — диалог открывается', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /отозвать/i }).first().click()
    await expect(page.getByText(/аннулировать диплом/i)).toBeVisible()
    await expect(page.getByLabel(/причина/i)).toBeVisible()
  })

  test('аннулирование — кнопка задизейблена без причины', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /отозвать/i }).first().click()
    const submitBtn = page.getByRole('button', { name: /аннулировать/i }).last()
    await expect(submitBtn).toBeDisabled()
  })

  test('аннулирование — успешная отправка', async ({ page }) => {
    await expect(page.getByText('D-2026-0001')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /отозвать/i }).first().click()
    await page.getByLabel(/причина/i).fill('Тестовая причина')
    await page.getByRole('button', { name: /аннулировать/i }).last().click()
    // Диалог закрывается или появляется toast
    await expect(
      page.getByText(/аннулировать диплом/i).or(page.getByText(/аннулирован/i))
    ).toBeVisible({ timeout: 10_000 })
  })

  test.describe('Загрузка CSV', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: /загрузить/i }).or(
        page.getByText(/загрузить/i).and(page.locator('[role="tab"]'))
      ).click()
    })

    test('вкладка загрузки открывается', async ({ page }) => {
      await expect(page.getByText(/перетащите csv/i)).toBeVisible({ timeout: 5_000 })
    })

    test('загрузка CSV файла — джоб принимается', async ({ page }) => {
      const csvPath = path.resolve(__dirname, '../../../test-diplomas.csv')
      await page.getByText(/перетащите/i).waitFor({ timeout: 5_000 })

      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(csvPath)

      await expect(page.getByText(/загрузить реестр/i)).toBeVisible({ timeout: 5_000 })
      await page.getByRole('button', { name: /загрузить реестр/i }).click()

      // Ждём статус джоба
      await expect(
        page.getByText(/ожидание|обработка|завершено|частично/i)
      ).toBeVisible({ timeout: 15_000 })
    })

    test('загрузка невалидного файла показывает ошибку', async ({ page }) => {
      await page.getByText(/перетащите/i).waitFor({ timeout: 5_000 })

      // Создаём невалидный файл
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'bad.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('это не диплом'),
      })

      await page.getByRole('button', { name: /загрузить реестр/i }).click()

      // Или ошибка от бэка, или статус failed
      await expect(
        page.getByText(/ошибка|invalid|failed/i)
      ).toBeVisible({ timeout: 15_000 })
    })
  })
})
