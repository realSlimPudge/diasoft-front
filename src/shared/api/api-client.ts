import axios from 'axios'
import { API_BASE_URL } from '@/shared/constants/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function getTokenCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)diasoft_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

apiClient.interceptors.request.use((config) => {
  const token = getTokenCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message: string =
      error?.response?.data?.error ?? error?.message ?? 'Unknown error'
    return Promise.reject(new Error(message))
  },
)
