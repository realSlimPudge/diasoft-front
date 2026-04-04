import { Outlet } from '@tanstack/react-router'
import { AppHeader } from './AppHeader'
import { Toaster } from '@/shared/components/ui/sonner'
import { AuthProvider } from '@/entities/auth/lib/use-auth'
import { CursorGlow } from '@/shared/components/ui/cursor-glow'

export function AppLayout() {
  return (
    <AuthProvider>
      <div className="noise-overlay relative flex min-h-svh flex-col">
        <CursorGlow />
        <AppHeader />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </AuthProvider>
  )
}
