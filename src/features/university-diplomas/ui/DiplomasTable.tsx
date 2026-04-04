import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, AlertTriangle, QrCode, ChevronDown, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Label } from '@/shared/components/ui/label'
import { registryApi } from '@/entities/diploma-registry/api/registry.api'
import { registryKeys } from '@/entities/diploma-registry/api/registry.keys'
import type { DiplomaRecord, DiplomaStatus } from '@/entities/diploma-registry/api/dto/registry.types'
import { cn } from '@/shared/lib/utils'

const statusBadge: Record<DiplomaStatus, { label: string; className: string }> = {
  active: { label: 'Действителен', className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800' },
  revoked: { label: 'Аннулирован', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800' },
  expired: { label: 'Истёк', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800' },
}

export function DiplomasTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [revokeTarget, setRevokeTarget] = useState<DiplomaRecord | null>(null)
  const [revokeReason, setRevokeReason] = useState('')
  const queryClient = useQueryClient()

  const { data, isPending, refetch } = useQuery({
    queryKey: registryKeys.list({ search, status: statusFilter }),
    queryFn: () => registryApi.list({ search: search || undefined, status: statusFilter || undefined }),
  })

  const { mutate: revoke, isPending: isRevoking } = useMutation({
    mutationFn: (diploma: DiplomaRecord) => registryApi.revoke({ diplomaId: diploma.id, reason: revokeReason }),
    onSuccess: () => {
      toast.success('Диплом аннулирован')
      queryClient.invalidateQueries({ queryKey: registryKeys.list() })
      setRevokeTarget(null)
      setRevokeReason('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по ФИО или номеру диплома..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              {statusFilter ? statusBadge[statusFilter as DiplomaStatus]?.label : 'Все статусы'}
              <ChevronDown size={13} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter('')}>Все статусы</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>Действительные</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('revoked')}>Аннулированные</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('expired')}>Истёкшие</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw size={15} />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Владелец</TableHead>
              <TableHead>Номер диплома</TableHead>
              <TableHead>Специальность</TableHead>
              <TableHead>Год</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.items.map((diploma) => {
                  const badge = statusBadge[diploma.status]
                  return (
                    <TableRow key={diploma.id}>
                      <TableCell className="font-medium">{diploma.ownerName}</TableCell>
                      <TableCell className="font-mono text-sm">{diploma.diplomaNumber}</TableCell>
                      <TableCell className="max-w-48 truncate text-sm text-muted-foreground">{diploma.program}</TableCell>
                      <TableCell className="text-sm">{diploma.graduationYear}</TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', badge.className)}>
                          {badge.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/v/${diploma.verificationToken}`, '_blank')}
                          >
                            <QrCode size={13} data-icon="inline-start" />
                            QR
                          </Button>
                          {diploma.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setRevokeTarget(diploma)}
                            >
                              <AlertTriangle size={13} data-icon="inline-start" />
                              Отозвать
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

            {!isPending && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Дипломы не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <p className="text-xs text-muted-foreground">
          Показано {data.items.length} из {data.total} записей
        </p>
      )}

      {/* Revoke dialog */}
      <Dialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Аннулировать диплом</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium">{revokeTarget?.ownerName}</p>
              <p className="text-muted-foreground">{revokeTarget?.diplomaNumber} · {revokeTarget?.program}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason">Причина аннулирования</Label>
              <Input
                id="reason"
                placeholder="Выявлен подлог, нарушение условий..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRevokeTarget(null)}>Отмена</Button>
              <Button
                variant="destructive"
                disabled={!revokeReason.trim() || isRevoking}
                onClick={() => revokeTarget && revoke(revokeTarget)}
              >
                {isRevoking && <RefreshCw size={13} className="animate-spin" data-icon="inline-start" />}
                Аннулировать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
