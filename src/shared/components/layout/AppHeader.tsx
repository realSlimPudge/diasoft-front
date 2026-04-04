import { Link } from '@tanstack/react-router'
import { Shield, GraduationCap, Briefcase, User, LogOut } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/entities/auth/lib/use-auth'
import { useRouter } from '@tanstack/react-router'

const roleLinks = {
  university: { to: '/university', label: 'Кабинет ВУЗа', icon: GraduationCap },
  student: { to: '/student', label: 'Мой диплом', icon: User },
  hr: { to: '/hr', label: 'HR-портал', icon: Briefcase },
} as const

export function AppHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  const roleLink = user ? roleLinks[user.role] : null
  const RoleIcon = roleLink?.icon

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Shield size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">DiaSoft Verify</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            activeProps={{ className: 'text-foreground font-medium bg-accent' }}
          >
            Проверить диплом
          </Link>

          {user && roleLink && RoleIcon && (
            <Link
              to={roleLink.to}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeProps={{ className: 'text-foreground font-medium bg-accent' }}
            >
              <RoleIcon size={13} />
              {roleLink.label}
            </Link>
          )}

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
              <LogOut size={13} />
              Выйти
            </Button>
          ) : (
            <Link
              to="/login"
              className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
      <Separator />
    </header>
  )
}
