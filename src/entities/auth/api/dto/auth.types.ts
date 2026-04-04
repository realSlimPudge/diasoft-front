import type { UserRole } from '../../model/user'

export interface LoginRequest {
  login: string
  password: string
  role: UserRole
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    name: string
    role: UserRole
    organizationCode?: string
  }
}
