import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { Link2, Copy, Trash2, Loader2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { studentApi } from '@/entities/student-diploma/api/student.api'
import type { ShareLinkResponse, ShareLinkRequest } from '@/entities/student-diploma/api/dto/student.types'

const TTL_OPTIONS: { label: string; seconds: ShareLinkRequest['ttlSeconds'] }[] = [
  { label: '1ч', seconds: 3600 },
  { label: '24ч', seconds: 86400 },
  { label: '7д', seconds: 604800 },
  { label: '30д', seconds: 2592000 },
]

export function ShareLinkGenerator() {
  const [ttl, setTtl] = useState<ShareLinkRequest['ttlSeconds']>(86400)
  const [link, setLink] = useState<ShareLinkResponse | null>(null)

  const { mutate: generate, isPending } = useMutation({
    mutationFn: () => studentApi.generateShareLink({ ttlSeconds: ttl }),
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

  return (
    <div className="border border-border/40">
      {/* Header row */}
      <div className="flex items-center gap-3 border-b border-border/30 px-5 py-4">
        <Link2 size={13} className="text-primary" />
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-widest text-foreground uppercase">
            Поделиться с работодателем
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/60">
            Создайте временную ссылку для просмотра диплома
          </p>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!link ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* TTL selector */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
                  Время действия
                </span>
                <div className="flex gap-0 border border-border/40">
                  {TTL_OPTIONS.map(({ label, seconds }, i) => (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => setTtl(seconds)}
                      className={cn(
                        'flex-1 py-2 font-mono text-xs font-medium tracking-wide transition-colors',
                        i < TTL_OPTIONS.length - 1 && 'border-r border-border/40',
                        ttl === seconds
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => generate()}
                disabled={isPending}
                className="rounded-none bg-primary font-mono text-[10px] tracking-widest uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-25"
              >
                {isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <Link2 size={12} className="mr-2" />
                    Создать ссылку
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* Link display */}
              <div className="border border-border/30 bg-muted/10 p-4">
                <p className="mb-1.5 font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">
                  Ссылка
                </p>
                <p className="break-all font-mono text-xs text-foreground">{link.shareUrl}</p>
              </div>

              {/* Expiry */}
              <div className="flex items-center gap-2">
                <Clock size={11} className="text-muted-foreground/50" />
                <span className="font-mono text-[9px] text-muted-foreground/60">
                  До{' '}
                  {new Date(link.expiresAt).toLocaleDateString('ru-RU', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(link.shareUrl)
                    toast.success('Скопировано')
                  }}
                  className="flex-1 rounded-none bg-primary font-mono text-[10px] tracking-widest uppercase text-primary-foreground hover:opacity-90"
                >
                  <Copy size={12} className="mr-2" />
                  Скопировать
                </Button>
                <Button
                  variant="outline"
                  onClick={() => revoke()}
                  disabled={isRevoking}
                  className="rounded-none border-border/40 px-3 text-muted-foreground hover:border-red-400/40 hover:text-red-400"
                >
                  {isRevoking ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
