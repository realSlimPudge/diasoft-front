import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { GraduationCap, Briefcase, User, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { authApi } from '@/entities/auth/api/auth.api'
import { useAuth } from '@/entities/auth/lib/use-auth'
import type { UserRole } from '@/entities/auth/model/user'

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'university',
    label: 'ВУЗ',
    description: 'Управление реестром дипломов',
    icon: GraduationCap,
  },
  {
    value: 'hr',
    label: 'HR / Работодатель',
    description: 'Проверка документов кандидатов',
    icon: Briefcase,
  },
  {
    value: 'student',
    label: 'Студент / Выпускник',
    description: 'Доступ к своему диплому',
    icon: User,
  },
]

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
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Вход в систему</h1>
        <p className="text-sm text-muted-foreground">DiaSoft — Платформа верификации дипломов</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-3 gap-2">
        {roles.map(({ value, label, description, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all hover:border-primary/50 hover:bg-accent',
              role === value
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card',
            )}
          >
            <div className={cn('flex size-8 items-center justify-center rounded-lg', role === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              <Icon size={16} />
            </div>
            <span className={cn('text-xs font-medium leading-tight', role === value ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block leading-tight">{description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="login">
            {role === 'university' ? 'Код ВУЗа' : role === 'student' ? 'Номер диплома / ФИО' : 'Логин'}
          </Label>
          <Input
            id="login"
            placeholder={role === 'university' ? 'ITMO' : role === 'student' ? 'D-2026-0001' : 'hr@company.ru'}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={isPending || !login || !password} className="w-full">
          {isPending && <Loader2 size={15} className="animate-spin" data-icon="inline-start" />}
          {isPending ? 'Входим...' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
