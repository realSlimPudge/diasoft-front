import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { DiplomaQrCard } from '@/features/student-qr/ui/DiplomaQrCard'
import { ShareLinkGenerator } from '@/features/student-share/ui/ShareLinkGenerator'
import { studentApi } from '@/entities/student-diploma/api/student.api'
import { useAuth } from '@/entities/auth/lib/use-auth'

export function StudentPage() {
  const { user } = useAuth()

  const { data: diploma, isPending, isError, error } = useQuery({
    queryKey: ['student', 'diploma'],
    queryFn: () => studentApi.myDiploma(),
    staleTime: 1000 * 60 * 10,
  })

  return (
    <div className="relative mx-auto w-full max-w-3xl px-6 py-12">

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className="relative mb-12 flex items-end justify-between border-b border-border/30 pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            — Кабинет студента
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">
            МОЙ<br />ДИПЛОМ
          </h1>
          {user?.name && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">{user.name}</p>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6"
      >
        {isPending && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-64 w-full rounded-none" />
            <Skeleton className="h-48 w-full rounded-none" />
          </div>
        )}

        {isError && (
          <Alert variant="destructive" className="rounded-none border-red-400/30 bg-red-400/8">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {diploma && (
          <>
            <DiplomaQrCard diploma={diploma} />
            <ShareLinkGenerator />
          </>
        )}
      </motion.div>
    </div>
  )
}
