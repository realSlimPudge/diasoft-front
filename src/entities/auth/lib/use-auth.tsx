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
    localStorage.setItem('diasoft_access_token', token)
    storeUser(user)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('diasoft_access_token')
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
