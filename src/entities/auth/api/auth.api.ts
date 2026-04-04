import { apiClient } from '@/shared/api/api-client'
import type { LoginRequest, LoginResponse } from './dto/auth.types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/api/v1/auth/login', data).then((r) => r.data),

  me: () =>
    apiClient.get<LoginResponse['user']>('/api/v1/auth/me').then((r) => r.data),
}
