import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { studentApi } from '../student.api'
import { fixtures } from '@/test/msw/handlers'

const BASE = 'https://verify.team1.213.165.211.103.sslip.io'

describe('studentApi.myDiploma', () => {
  it('возвращает диплом студента', async () => {
    const result = await studentApi.myDiploma()
    expect(result.diplomaNumber).toBe('D-2026-0001')
    expect(result.universityCode).toBe('ITMO')
    expect(result.status).toBe('active')
    expect(result.verificationToken).toBeTruthy()
  })

  it('бросает ошибку при 401', async () => {
    server.use(
      http.get(`${BASE}/api/v1/student/diploma`, () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    )
    await expect(studentApi.myDiploma()).rejects.toThrow('Unauthorized')
  })

  it('возвращает аннулированный диплом', async () => {
    server.use(
      http.get(`${BASE}/api/v1/student/diploma`, () =>
        HttpResponse.json({ ...fixtures.studentDiploma, status: 'revoked' })
      )
    )
    const result = await studentApi.myDiploma()
    expect(result.status).toBe('revoked')
  })
})

describe('studentApi.generateShareLink', () => {
  it('создаёт share-link с ttlSeconds=86400', async () => {
    const result = await studentApi.generateShareLink({ ttlSeconds: 86400 })
    expect(result.shareToken).toBe(fixtures.shareLink.shareToken)
    expect(result.shareUrl).toContain('/s/')
    expect(result.ttlSeconds).toBe(86400)
  })

  it('создаёт share-link с ttlSeconds=3600', async () => {
    server.use(
      http.post(`${BASE}/api/v1/student/share-link`, async ({ request }) => {
        const body = await request.json() as { ttlSeconds: number }
        return HttpResponse.json({ ...fixtures.shareLink, ttlSeconds: body.ttlSeconds })
      })
    )
    const result = await studentApi.generateShareLink({ ttlSeconds: 3600 })
    expect(result.ttlSeconds).toBe(3600)
  })

  it('бросает ошибку при 401', async () => {
    server.use(
      http.post(`${BASE}/api/v1/student/share-link`, () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    )
    await expect(studentApi.generateShareLink({ ttlSeconds: 86400 })).rejects.toThrow()
  })
})

describe('studentApi.revokeShareLink', () => {
  it('отзывает share-link', async () => {
    await expect(
      studentApi.revokeShareLink(fixtures.shareLink.shareToken)
    ).resolves.not.toThrow()
  })

  it('бросает ошибку при отзыве несуществующего токена', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/student/share-link/:token`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    )
    await expect(studentApi.revokeShareLink('bad-token')).rejects.toThrow('Not found')
  })
})
