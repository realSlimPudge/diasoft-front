import { Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Shield size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">DiaSoft Verify</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
            activeProps={{ className: 'text-foreground font-medium bg-accent' }}
          >
            Главная
          </Link>
        </nav>
      </div>
      <Separator />
    </header>
  )
}
