import { Outlet } from '@tanstack/react-router'
import { AppHeader } from './AppHeader'
import { Toaster } from '@/shared/components/ui/sonner'
import { AuthProvider } from '@/entities/auth/lib/use-auth'

export function AppLayout() {
  return (
    <AuthProvider>
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DiaSoft — Система верификации документов об образовании
        </footer>
        <Toaster richColors position="top-right" />
      </div>
    </AuthProvider>
  )
}
