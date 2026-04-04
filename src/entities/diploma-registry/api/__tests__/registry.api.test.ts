import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { registryApi } from '../registry.api'
import { fixtures } from '@/test/msw/handlers'

const BASE = 'https://verify.team1.213.165.211.103.sslip.io'

describe('registryApi.list', () => {
  it('возвращает список дипломов с total', async () => {
    const result = await registryApi.list()
    expect(result.total).toBe(1)
    expect(result.items).toHaveLength(1)
    expect(result.items[0].diplomaNumber).toBe('D-2026-0001')
  })

  it('возвращает пустой список при отсутствии дипломов', async () => {
    server.use(
      http.get(`${BASE}/api/v1/university/diplomas`, () =>
        HttpResponse.json({ items: [], total: 0 })
      )
    )
    const result = await registryApi.list()
    expect(result.total).toBe(0)
    expect(result.items).toHaveLength(0)
  })

  it('бросает ошибку при 401', async () => {
    server.use(
      http.get(`${BASE}/api/v1/university/diplomas`, () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    )
    await expect(registryApi.list()).rejects.toThrow('Unauthorized')
  })
})

describe('registryApi.revoke', () => {
  it('аннулирует диплом по id', async () => {
    await expect(
      registryApi.revoke(fixtures.diploma.id, { reason: 'Выявлен подлог' })
    ).resolves.not.toThrow()
  })

  it('бросает ошибку при аннулировании несуществующего диплома', async () => {
    server.use(
      http.post(`${BASE}/api/v1/university/diplomas/:id/revoke`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    )
    await expect(
      registryApi.revoke('non-existent-id', { reason: 'test' })
    ).rejects.toThrow('Not found')
  })
})

describe('registryApi.uploadCsv', () => {
  it('загружает файл и возвращает jobId', async () => {
    const file = new File(['name,diploma_number,program,graduation_year\nИван Иванов,D-2026-0002,CS,2026'], 'test.csv', { type: 'text/csv' })
    const result = await registryApi.uploadCsv(file)
    expect(result.jobId).toBe(fixtures.importJob.jobId)
    expect(result.status).toBe('pending')
  })

  it('отклоняет невалидный файл', async () => {
    server.use(
      http.post(`${BASE}/api/v1/university/diplomas/upload`, () =>
        HttpResponse.json({ error: 'Invalid file format' }, { status: 400 })
      )
    )
    const file = new File(['invalid content'], 'bad.txt', { type: 'text/plain' })
    await expect(registryApi.uploadCsv(file)).rejects.toThrow('Invalid file format')
  })
})

describe('registryApi.getImportStatus', () => {
  it('возвращает статус завершённого джоба', async () => {
    const result = await registryApi.getImportStatus(fixtures.importJob.jobId)
    expect(result.status).toBe('completed')
    expect(result.total).toBe(10)
    expect(result.imported).toBe(10)
    expect(result.failed).toBe(0)
  })

  it('возвращает статус с ошибками при частичном импорте', async () => {
    server.use(
      http.get(`${BASE}/api/v1/university/imports/:jobId`, () =>
        HttpResponse.json({
          jobId: fixtures.importJob.jobId,
          status: 'partially_failed',
          total: 10,
          imported: 8,
          failed: 2,
          createdAt: '2026-04-04T10:00:00Z',
          updatedAt: '2026-04-04T10:05:00Z',
        })
      )
    )
    const result = await registryApi.getImportStatus(fixtures.importJob.jobId)
    expect(result.status).toBe('partially_failed')
    expect(result.failed).toBe(2)
  })
})

describe('registryApi.getImportErrors', () => {
  it('возвращает пустой список при успешном импорте', async () => {
    const result = await registryApi.getImportErrors(fixtures.importJob.jobId)
    expect(result.errors).toHaveLength(0)
  })

  it('возвращает список ошибок', async () => {
    server.use(
      http.get(`${BASE}/api/v1/university/imports/:jobId/errors`, () =>
        HttpResponse.json({
          errors: [
            { row: 3, message: 'Некорректный год выпуска' },
            { row: 7, message: 'Отсутствует номер диплома' },
          ]
        })
      )
    )
    const result = await registryApi.getImportErrors(fixtures.importJob.jobId)
    expect(result.errors).toHaveLength(2)
    expect(result.errors[0].row).toBe(3)
    expect(result.errors[0].message).toBe('Некорректный год выпуска')
  })
})
