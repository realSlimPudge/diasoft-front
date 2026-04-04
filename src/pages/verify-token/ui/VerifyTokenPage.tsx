import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, RefreshCw, QrCode } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { VerificationCard } from '@/features/verification-result/ui/VerificationCard'
import { diplomaOptions } from '@/entities/diploma/api/diploma.options'

interface VerifyTokenPageProps {
  token: string
}

export function VerifyTokenPage({ token }: VerifyTokenPageProps) {
  const { data, isPending, isError, error, refetch } = useQuery(diplomaOptions.byToken(token))

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <QrCode size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Верификация по QR-коду</h1>
          <p className="text-sm text-muted-foreground font-mono truncate max-w-xs">{token}</p>
        </div>
      </div>

      {isPending && <VerifyTokenSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-4">
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw size={14} data-icon="inline-start" />
            Повторить
          </Button>
        </div>
      )}

      {data && (
        <div className="flex justify-center">
          <VerificationCard result={data} />
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft size={14} data-icon="inline-start" />
            На главную
          </Link>
        </Button>
      </div>
    </div>
  )
}

function VerifyTokenSkeleton() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
