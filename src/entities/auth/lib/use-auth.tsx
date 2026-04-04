import { createContext, useContext, useState, type ReactNode } from 'react'
import { getStoredUser, storeUser, clearUser } from './auth-store'
import type { AuthUser } from '../model/user'

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())

  const login = (user: AuthUser, token: string) => {
    document.cookie = `diasoft_token=${encodeURIComponent(token)}; path=/; SameSite=Strict`
    storeUser(user)
    setUser(user)
  }

  const logout = () => {
    document.cookie = 'diasoft_token=; path=/; max-age=0'
    clearUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
