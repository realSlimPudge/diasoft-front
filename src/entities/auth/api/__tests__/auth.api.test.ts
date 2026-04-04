import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { authApi } from '../auth.api'
import { fixtures } from '@/test/msw/handlers'

const BASE = 'https://verify.team1.213.165.211.103.sslip.io'

describe('authApi.login', () => {
  it('возвращает токен и профиль при верных данных ВУЗа', async () => {
    const result = await authApi.login({ login: 'ITMO', password: 'secret', role: 'university' })
    expect(result.accessToken).toBe('test-jwt-token')
    expect(result.user.role).toBe('university')
    expect(result.user.organizationCode).toBe('ITMO')
  })

  it('возвращает токен и профиль при верных данных студента', async () => {
    const result = await authApi.login({ login: 'D-2026-0001', password: 'secret', role: 'student' })
    expect(result.user.role).toBe('student')
  })

  it('возвращает токен при верных данных HR', async () => {
    const result = await authApi.login({ login: 'hr@diplomverify.ru', password: 'secret', role: 'hr' })
    expect(result.user.role).toBe('hr')
  })

  it('бросает ошибку при неверном пароле', async () => {
    await expect(
      authApi.login({ login: 'ITMO', password: 'wrong', role: 'university' })
    ).rejects.toThrow('Invalid credentials')
  })

  it('бросает ошибку при неизвестном логине', async () => {
    await expect(
      authApi.login({ login: 'unknown', password: 'secret', role: 'hr' })
    ).rejects.toThrow()
  })

  it('возвращает профиль из /auth/me', async () => {
    const user = await authApi.me()
    expect(user.id).toBe(fixtures.universityUser.id)
    expect(user.role).toBe('university')
  })

  it('/auth/me возвращает 401 без токена', async () => {
    server.use(
      http.get(`${BASE}/api/v1/auth/me`, () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    )
    await expect(authApi.me()).rejects.toThrow()
  })
})
