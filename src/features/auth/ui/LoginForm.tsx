import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { authApi } from '@/entities/auth/api/auth.api'
import { useAuth } from '@/entities/auth/lib/use-auth'
import type { UserRole } from '@/entities/auth/model/user'

const roles: { value: UserRole; label: string; sub: string }[] = [
  { value: 'university', label: 'ВУЗ', sub: 'Управление реестром' },
  { value: 'hr', label: 'HR', sub: 'Проверка кандидатов' },
  { value: 'student', label: 'Студент', sub: 'Мой диплом' },
]

const placeholders: Record<UserRole, string> = {
  university: 'ITMO',
  hr: 'hr@company.ru',
  student: 'D-2026-0001',
}

export function LoginForm() {
  const [role, setRole] = useState<UserRole>('hr')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login: authLogin } = useAuth()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.login({ login, password, role }),
    onSuccess: (data) => {
      authLogin(
        { id: data.user.id, name: data.user.name, role: data.user.role, organizationCode: data.user.organizationCode },
        data.accessToken,
      )
      if (data.user.role === 'university') router.navigate({ to: '/university' })
      else if (data.user.role === 'student') router.navigate({ to: '/student' })
      else router.navigate({ to: '/hr' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      {/* Role selector */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
          Роль
        </span>
        <div className="grid grid-cols-3 gap-0 border border-border/40">
          {roles.map(({ value, label, sub }, i) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                'relative flex flex-col items-start gap-1 px-4 py-3 text-left transition-all',
                i < roles.length - 1 && 'border-r border-border/40',
                role === value
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground',
              )}
            >
              {role === value && (
                <motion.div
                  layoutId="role-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="font-mono text-xs font-semibold tracking-wide">{label}</span>
              <span className="font-mono text-[9px] tracking-wide text-muted-foreground/60 leading-none">
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <form
        onSubmit={(e) => { e.preventDefault(); mutate() }}
        className="flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            {role === 'university' ? 'Код ВУЗа' : role === 'student' ? 'Номер диплома' : 'Логин'}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                placeholder={placeholders[role]}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={isPending}
                required
                className="rounded-none border-0 border-b border-border/50 bg-transparent px-0 py-2.5 text-sm placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:outline-none transition-colors"
              />
            </motion.div>
          </AnimatePresence>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            Пароль
          </span>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
              className="rounded-none border-0 border-b border-border/50 bg-transparent px-0 py-2.5 pr-8 text-sm placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isPending || !login || !password}
            className="group w-full rounded-none bg-primary py-5 font-mono text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-25"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                ВХОДИМ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ВОЙТИ
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
