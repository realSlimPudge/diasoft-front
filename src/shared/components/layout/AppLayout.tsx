import { Outlet } from '@tanstack/react-router'
import { AppHeader } from './AppHeader'
import { Toaster } from '@/shared/components/ui/sonner'

export function AppLayout() {
  return (
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
  )
}
