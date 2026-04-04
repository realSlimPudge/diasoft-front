import { Link } from '@tanstack/react-router'
import { useAuth } from '@/entities/auth/lib/use-auth'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'

const roleLinks = {
  university: { to: '/university', label: 'Кабинет ВУЗа' },
  student: { to: '/student', label: 'Мой диплом' },
  hr: { to: '/hr', label: 'HR-портал' },
} as const

export function AppHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  const roleLink = user ? roleLinks[user.role] : null

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-70"
        >
          <div className="relative flex size-6 items-center justify-center">
            <div className="absolute inset-0 rounded-sm bg-primary opacity-80" />
            <div className="absolute inset-[2px] rounded-[2px] bg-background" />
            <div className="relative size-2 rounded-[1px] bg-primary" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-widest uppercase opacity-90">
            DiaSoft
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            activeProps={{ className: 'text-foreground' }}
          >
            Проверить
          </Link>

          {user && roleLink && (
            <Link
              to={roleLink.to}
              className="px-3 py-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
              activeProps={{ className: 'text-foreground' }}
            >
              {roleLink.label}
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              Выйти
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-2 border border-border px-3 py-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>

      {/* Thin separator */}
      <div className="h-px bg-border/40" />
    </motion.header>
  )
}
