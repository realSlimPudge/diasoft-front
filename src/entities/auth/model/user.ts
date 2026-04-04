export type UserRole = 'university' | 'student' | 'hr'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  organizationCode?: string // for university: university code
}
