import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { diplomaApi } from '../diploma.api'

const BASE = 'https://verify.team1.213.165.211.103.sslip.io'

describe('diplomaApi.verifyByForm', () => {
  it('возвращает valid для существующего диплома', async () => {
    const result = await diplomaApi.verifyByForm({ diplomaNumber: 'D-2026-0001', universityCode: 'ITMO' })
    expect(result.verdict).toBe('valid')
    expect(result.ownerNameMask).toBe('И*** И***')
    expect(result.program).toBe('Software Engineering')
  })

  it('возвращает not_found для несуществующего', async () => {
    const result = await diplomaApi.verifyByForm({ diplomaNumber: 'FAKE-0000', universityCode: 'ITMO' })
    expect(result.verdict).toBe('not_found')
  })

  it('обрабатывает 400 от сервера', async () => {
    server.use(
      http.post(`${BASE}/api/v1/public/verify`, () =>
        HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
      )
    )
    await expect(
      diplomaApi.verifyByForm({ diplomaNumber: '', universityCode: '' })
    ).rejects.toThrow('Invalid request')
  })
})

describe('diplomaApi.verifyByToken', () => {
  it('возвращает результат по валидному токену', async () => {
    const result = await diplomaApi.verifyByToken('itmo-demo-verify-token')
    expect(result.verdict).toBe('valid')
    expect(result.universityCode).toBe('ITMO')
  })

  it('возвращает not_found по неизвестному токену', async () => {
    const result = await diplomaApi.verifyByToken('unknown-token')
    expect(result.verdict).toBe('not_found')
  })
})

describe('diplomaApi.resolveShareLink', () => {
  it('разрешает share-link по токену', async () => {
    const result = await diplomaApi.resolveShareLink('test-share-token')
    expect(result.verdict).toBe('valid')
  })

  it('возвращает ошибку для несуществующего share-link', async () => {
    await expect(diplomaApi.resolveShareLink('bad-token')).rejects.toThrow()
  })
})
