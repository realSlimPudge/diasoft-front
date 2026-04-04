import { useQuery } from '@tanstack/react-query'
import { User, LogOut } from 'lucide-react'
import { queryOptions } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Separator } from '@/shared/components/ui/separator'
import { DiplomaQrCard } from '@/features/student-qr/ui/DiplomaQrCard'
import { ShareLinkGenerator } from '@/features/student-share/ui/ShareLinkGenerator'
import { studentApi } from '@/entities/student-diploma/api/student.api'
import { useAuth } from '@/entities/auth/lib/use-auth'
import { useRouter } from '@tanstack/react-router'

const myDiplomaOptions = queryOptions({
  queryKey: ['student', 'diploma'],
  queryFn: () => studentApi.myDiploma(),
  staleTime: 1000 * 60 * 10,
})

export function StudentPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { data: diploma, isPending, isError, error } = useQuery(myDiplomaOptions)

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Мой диплом</h1>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={14} data-icon="inline-start" />
          Выйти
        </Button>
      </div>

      <Separator className="mb-8" />

      {isPending && (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {diploma && (
        <div className="flex flex-col gap-6">
          <DiplomaQrCard diploma={diploma} />
          <ShareLinkGenerator />
        </div>
      )}
    </div>
  )
}
