import type { Page } from '@playwright/test'

export const CREDENTIALS = {
  university: { login: 'ITMO', password: 'secret', role: 'university' as const },
  student: { login: 'D-2026-0001', password: 'secret', role: 'student' as const },
  hr: { login: 'hr@diplomverify.ru', password: 'secret', role: 'hr' as const },
}

export async function loginAs(page: Page, role: keyof typeof CREDENTIALS) {
  const creds = CREDENTIALS[role]
  await page.goto('/login')

  // Select role tab
  const roleLabels = { university: 'ВУЗ', student: 'Студент', hr: 'HR' }
  await page.getByText(roleLabels[role], { exact: true }).click()

  // Fill credentials
  await page.getByPlaceholder(/.+/).first().fill(creds.login)
  await page.getByPlaceholder('••••••••').fill(creds.password)
  await page.getByRole('button', { name: /войти/i }).click()
}

export async function logout(page: Page) {
  await page.getByText(/выйти/i).click()
}
