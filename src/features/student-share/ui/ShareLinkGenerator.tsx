import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link2, Clock, Copy, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { studentApi } from '@/entities/student-diploma/api/student.api'
import type { ShareLinkResponse } from '@/entities/student-diploma/api/dto/student.types'

const TTL_OPTIONS = [
  { label: '1 час', seconds: 3600 },
  { label: '24 часа', seconds: 86400 },
  { label: '7 дней', seconds: 604800 },
  { label: '30 дней', seconds: 2592000 },
]

export function ShareLinkGenerator() {
  const [ttl, setTtl] = useState(86400)
  const [link, setLink] = useState<ShareLinkResponse | null>(null)

  const { mutate: generate, isPending } = useMutation({
    mutationFn: () => studentApi.generateShareLink(ttl),
    onSuccess: (data) => setLink(data),
    onError: (err: Error) => toast.error(err.message),
  })

  const { mutate: revoke, isPending: isRevoking } = useMutation({
    mutationFn: () => studentApi.revokeShareLink(link!.shareToken),
    onSuccess: () => {
      toast.success('Ссылка отозвана')
      setLink(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const copy = () => {
    if (!link) return
    navigator.clipboard.writeText(link.shareUrl)
    toast.success('Ссылка скопирована')
  }

  const expiresAt = link ? new Date(link.expiresAt) : null

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Link2 size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Поделиться с работодателем</h3>
          <p className="text-sm text-muted-foreground">Создайте временную ссылку для просмотра вашего диплома</p>
        </div>
      </div>

      {!link && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Время действия ссылки</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TTL_OPTIONS.map(({ label, seconds }) => (
                <button
                  key={seconds}
                  type="button"
                  onClick={() => setTtl(seconds)}
                  className={cn(
                    'rounded-lg border py-2 text-sm font-medium transition-colors',
                    ttl === seconds
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => generate()} disabled={isPending}>
            {isPending ? <Loader2 size={15} className="animate-spin" data-icon="inline-start" /> : <Link2 size={15} data-icon="inline-start" />}
            {isPending ? 'Создаём ссылку...' : 'Создать ссылку'}
          </Button>
        </div>
      )}

      {link && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground mb-2">Ссылка для работодателя</p>
            <p className="text-sm font-mono break-all text-foreground">{link.shareUrl}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={13} />
            <span>
              Действует до {expiresAt?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
              {expiresAt?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex gap-2">
            <Button onClick={copy} className="flex-1">
              <Copy size={14} data-icon="inline-start" />
              Скопировать ссылку
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => revoke()} disabled={isRevoking}>
              {isRevoking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
