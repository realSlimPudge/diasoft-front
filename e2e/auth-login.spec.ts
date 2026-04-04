import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Авторизация', () => {
  test.beforeEach(async ({ page }) => {
    // Очищаем localStorage перед каждым тестом
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
  })

  test('страница логина отображается корректно', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/вход/i)).toBeVisible()
    await expect(page.getByText('ВУЗ')).toBeVisible()
    await expect(page.getByText('HR')).toBeVisible()
    await expect(page.getByText('Студент')).toBeVisible()
  })

  test('логин ВУЗа — редирект на /university', async ({ page }) => {
    await loginAs(page, 'university')
    await expect(page).toHaveURL(/\/university/, { timeout: 10_000 })
    await expect(page.getByText(/реестр дипломов/i)).toBeVisible({ timeout: 10_000 })
  })

  test('логин студента — редирект на /student', async ({ page }) => {
    await loginAs(page, 'student')
    await expect(page).toHaveURL(/\/student/, { timeout: 10_000 })
    await expect(page.getByText(/мой диплом/i)).toBeVisible({ timeout: 10_000 })
  })

  test('логин HR — редирект на /hr', async ({ page }) => {
    await loginAs(page, 'hr')
    await expect(page).toHaveURL(/\/hr/, { timeout: 10_000 })
    await expect(page.getByText(/проверка кандидатов/i)).toBeVisible({ timeout: 10_000 })
  })

  test('неверный пароль — показывает ошибку', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('ВУЗ').click()
    await page.getByPlaceholder(/ITMO/i).fill('ITMO')
    await page.getByPlaceholder('••••••••').fill('wrong-password')
    await page.getByRole('button', { name: /войти/i }).click()
    await expect(page.getByText(/invalid|неверн|ошибка/i)).toBeVisible({ timeout: 10_000 })
  })

  test('незалогиненный пользователь редиректится с /university на /login', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.goto('/university')
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('незалогиненный пользователь редиректится с /student на /login', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.goto('/student')
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('выход из системы очищает сессию', async ({ page }) => {
    await loginAs(page, 'university')
    await expect(page).toHaveURL(/\/university/, { timeout: 10_000 })
    await page.getByText(/выйти/i).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })
})
