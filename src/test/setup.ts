import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './msw/server'

// jsdom не поддерживает document.cookie полностью — задаём простой mock
let cookieStore = ''
Object.defineProperty(document, 'cookie', {
  get: () => cookieStore,
  set: (val: string) => {
    // При max-age=0 — удаляем куку
    if (val.includes('max-age=0')) {
      const name = val.split('=')[0].trim()
      cookieStore = cookieStore
        .split(';')
        .filter((c) => !c.trim().startsWith(name + '='))
        .join(';')
    } else {
      const [pair] = val.split(';')
      const [name] = pair.split('=')
      // Удаляем старое значение если есть
      cookieStore = cookieStore
        .split(';')
        .filter((c) => !c.trim().startsWith(name.trim() + '='))
        .join(';')
      cookieStore = cookieStore ? `${cookieStore}; ${pair}` : pair
    }
  },
  configurable: true,
})

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  server.resetHandlers()
  cookieStore = ''
})
afterAll(() => server.close())
