import axios from 'axios'
import { API_BASE_URL } from '@/shared/constants/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message: string =
      error?.response?.data?.error ?? error?.message ?? 'Unknown error'
    return Promise.reject(new Error(message))
  },
)
