import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search, AlertTriangle, QrCode, RefreshCw, ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Label } from '@/shared/components/ui/label'
import { registryApi } from '@/entities/diploma-registry/api/registry.api'
import { registryKeys } from '@/entities/diploma-registry/api/registry.keys'
import type { Diploma, DiplomaStatus } from '@/entities/diploma-registry/api/dto/registry.types'
import { cn } from '@/shared/lib/utils'
import { useDebounce } from '@/shared/lib/use-debounce'

// должно совпадать с тем что возвращает бек на одну страницу
const PAGE_SIZE = 20

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i)

const statusMeta: Record<DiplomaStatus, { label: string; dot: string }> = {
  active:  { label: 'Действителен', dot: 'bg-green-400' },
  revoked: { label: 'Аннулирован',  dot: 'bg-red-400' },
  expired: { label: 'Истёк',        dot: 'bg-amber-400' },
}

const COL_WIDTHS = ['minmax(160px,1fr)', '140px', 'minmax(160px,1fr)', '64px', '120px', '140px']
const GRID = COL_WIDTHS.join(' ')
const ROW_HEIGHT = 48

export function DiplomasTable() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatus]     = useState<DiplomaStatus | ''>('')
  const [yearFilter, setYear]         = useState<number | undefined>(undefined)
  const [revokeTarget, setRevoke]     = useState<Diploma | null>(null)
  const [revokeReason, setReason]     = useState('')

  const debouncedSearch = useDebounce(search, 350)
  const queryClient     = useQueryClient()
  const scrollRef       = useRef<HTMLDivElement>(null)

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, status: statusFilter || undefined, year: yearFilter }),
    [debouncedSearch, statusFilter, yearFilter],
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isFetching,
  } = useInfiniteQuery({
    queryKey: registryKeys.list(filters),
    queryFn: ({ pageParam }) =>
      registryApi.list({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0)
      return loaded < lastPage.total ? allPages.length + 1 : undefined
    },
  })

  const allRows = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  )
  const total = data?.pages[0]?.total ?? 0

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // fetch next page when last sentinel row becomes visible
  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1]
    if (!last) return
    if (last.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [virtualItems, allRows.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  const { mutate: revoke, isPending: isRevoking } = useMutation({
    mutationFn: (d: Diploma) => registryApi.revoke(d.id, { reason: revokeReason }),
    onSuccess: () => {
      toast.success('Диплом аннулирован')
      queryClient.invalidateQueries({ queryKey: registryKeys.lists() })
      setRevoke(null)
      setReason('')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: registryKeys.lists() })
  }, [queryClient])

  return (
    <div className="flex flex-col gap-0">

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Поиск по ФИО или номеру диплома..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-none border-0 border-b bg-transparent pl-9 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground/30 transition-colors"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none border-b border-border/40 px-3 font-mono text-[10px] tracking-widest uppercase hover:border-foreground/30 gap-1.5 transition-colors"
            >
              {statusFilter ? statusMeta[statusFilter].label : 'Все статусы'}
              <ChevronDown size={11} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-none border-border/40 bg-background/95 backdrop-blur-sm">
            <DropdownMenuItem className="font-mono text-xs" onClick={() => setStatus('')}>Все статусы</DropdownMenuItem>
            {(Object.entries(statusMeta) as [DiplomaStatus, typeof statusMeta[DiplomaStatus]][]).map(([key, m]) => (
              <DropdownMenuItem key={key} className="font-mono text-xs gap-2" onClick={() => setStatus(key)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} />
                {m.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none border-b border-border/40 px-3 font-mono text-[10px] tracking-widest uppercase hover:border-foreground/30 gap-1.5 transition-colors"
            >
              {yearFilter ?? 'Год выпуска'}
              <ChevronDown size={11} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-none border-border/40 bg-background/95 backdrop-blur-sm max-h-60 overflow-auto">
            <DropdownMenuItem className="font-mono text-xs" onClick={() => setYear(undefined)}>Все годы</DropdownMenuItem>
            {YEARS.map((y) => (
              <DropdownMenuItem key={y} className="font-mono text-xs" onClick={() => setYear(y)}>
                {y}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-none border-b border-border/40 hover:border-foreground/30 transition-colors"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw size={13} className={cn(isFetching && 'animate-spin')} />
        </Button>
      </div>

      {/* ── Stats line ────────────────────────────────────────── */}
      <div className="mb-3 flex items-center gap-3">
        <p className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/40 uppercase">
          — {isPending ? '...' : `${allRows.length} / ${total}`} записей
        </p>
        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground/30 uppercase"
            >
              загрузка...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="border border-border/30 overflow-hidden">

        {/* Header */}
        <div
          className="grid border-b border-border/30 bg-muted/20"
          style={{ gridTemplateColumns: GRID }}
        >
          {['Владелец', 'Номер диплома', 'Специальность', 'Год', 'Статус', 'Действия'].map((h) => (
            <div key={h} className="px-4 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground/40 uppercase">
              {h}
            </div>
          ))}
        </div>

        {/* Virtualized body */}
        <div
          ref={scrollRef}
          className="overflow-auto"
          style={{ height: Math.min(allRows.length * ROW_HEIGHT + 4, 560) }}
        >
          {isPending ? (
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="grid border-b border-border/20"
                  style={{ gridTemplateColumns: GRID, height: ROW_HEIGHT }}
                >
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="flex items-center px-4">
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : allRows.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/30 uppercase">
                Дипломы не найдены
              </p>
            </div>
          ) : (
            <div
              className="relative"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualItems.map((vItem) => {
                const isLoader = vItem.index >= allRows.length

                if (isLoader) {
                  return (
                    <div
                      key="loader"
                      className="absolute inset-x-0 flex items-center justify-center border-b border-border/20"
                      style={{ top: vItem.start, height: vItem.size }}
                    >
                      <Loader2 size={14} className="animate-spin text-muted-foreground/30" />
                    </div>
                  )
                }

                const d = allRows[vItem.index]
                const meta = statusMeta[d.status]

                return (
                  <div
                    key={d.id}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    className="absolute inset-x-0 grid border-b border-border/15 transition-colors hover:bg-muted/10 group"
                    style={{ top: vItem.start, gridTemplateColumns: GRID }}
                  >
                    <div className="flex items-center px-4 text-sm font-medium truncate">
                      {d.ownerName ?? d.ownerNameMask}
                    </div>
                    <div className="flex items-center px-4 font-mono text-[11px] text-muted-foreground">
                      {d.diplomaNumber}
                    </div>
                    <div className="flex items-center px-4 text-xs text-muted-foreground/70 truncate">
                      {d.program}
                    </div>
                    <div className="flex items-center px-4 font-mono text-xs text-muted-foreground/60">
                      {d.graduationYear ?? '—'}
                    </div>
                    <div className="flex items-center px-4">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide uppercase">
                        <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', meta.dot)} />
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.verificationToken && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-none px-2 font-mono text-[10px] tracking-wide uppercase"
                          onClick={() => window.open(`/v/${d.verificationToken}`, '_blank')}
                        >
                          <QrCode size={11} />
                          QR
                        </Button>
                      )}
                      {d.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-none px-2 font-mono text-[10px] tracking-wide uppercase text-destructive/70 hover:text-destructive"
                          onClick={() => setRevoke(d)}
                        >
                          <AlertTriangle size={11} />
                          Отозвать
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Revoke dialog ─────────────────────────────────────── */}
      <Dialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevoke(null)}>
        <DialogContent className="rounded-none border-border/40 bg-background p-0 max-w-md">
          <div className="border-b border-border/30 px-6 py-4">
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase mb-1">— Действие</p>
            <DialogHeader>
              <DialogTitle className="text-lg font-black tracking-tight uppercase">
                Аннулировать диплом
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="flex flex-col gap-5 px-6 py-5">
            <div className="border border-border/30 p-4">
              <p className="text-sm font-medium">{revokeTarget?.ownerName ?? revokeTarget?.ownerNameMask}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/50">
                {revokeTarget?.diplomaNumber} · {revokeTarget?.program}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground/50 uppercase">
                Причина аннулирования
              </Label>
              <Input
                placeholder="Выявлен подлог, нарушение условий..."
                value={revokeReason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-none border-0 border-b bg-transparent text-sm placeholder:text-muted-foreground/30 focus-visible:ring-0"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none font-mono text-[10px] tracking-widest uppercase"
                onClick={() => setRevoke(null)}
              >
                Отмена
              </Button>
              <Button
                size="sm"
                className="rounded-none bg-destructive font-mono text-[10px] tracking-widest uppercase hover:bg-destructive/90"
                disabled={!revokeReason.trim() || isRevoking}
                onClick={() => revokeTarget && revoke(revokeTarget)}
              >
                {isRevoking && <Loader2 size={11} className="animate-spin" />}
                Аннулировать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
