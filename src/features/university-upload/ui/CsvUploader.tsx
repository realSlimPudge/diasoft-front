import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { cn } from '@/shared/lib/utils'
import { registryApi } from '@/entities/diploma-registry/api/registry.api'
import { registryKeys } from '@/entities/diploma-registry/api/registry.keys'
import type { GatewayImportStatus } from '@/entities/diploma-registry/api/dto/registry.types'

const TERMINAL = new Set(['completed', 'partially_failed', 'failed'])

const statusIcon: Record<GatewayImportStatus['status'], React.ReactNode> = {
  pending: <Clock size={14} className="animate-pulse text-muted-foreground" />,
  processing: <Loader2 size={14} className="animate-spin text-primary" />,
  completed: <CheckCircle2 size={14} className="text-green-500" />,
  partially_failed: <CheckCircle2 size={14} className="text-amber-500" />,
  failed: <XCircle size={14} className="text-red-500" />,
}

const statusLabel: Record<GatewayImportStatus['status'], string> = {
  pending: 'Ожидание...',
  processing: 'Обработка...',
  completed: 'Завершено',
  partially_failed: 'Частично завершено',
  failed: 'Ошибка',
}

export function CsvUploader() {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const { data: job } = useQuery({
    queryKey: ['import', 'status', jobId],
    queryFn: () => registryApi.getImportStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && TERMINAL.has(status) ? false : 2000
    },
  })

  const { data: errorsData } = useQuery({
    queryKey: ['import', 'errors', jobId],
    queryFn: () => registryApi.getImportErrors(jobId!),
    enabled: !!jobId && !!job && (job.status === 'partially_failed' || job.status === 'failed'),
  })

  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: (f: File) => registryApi.uploadCsv(f),
    onSuccess: (data) => {
      setJobId(data.jobId)
      setFile(null)
      queryClient.invalidateQueries({ queryKey: registryKeys.list() })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setJobId(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const reset = () => {
    setFile(null)
    setJobId(null)
  }

  const isDone = job && TERMINAL.has(job.status)

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      {!jobId && (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-3 border-2 border-dashed p-8 transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50',
            isUploading && 'pointer-events-none opacity-50',
          )}
        >
          <input {...getInputProps()} />
          <div className="flex size-12 items-center justify-center bg-primary/10">
            {file ? <FileSpreadsheet size={24} className="text-primary" /> : <Upload size={24} className="text-primary" />}
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">
              {file ? file.name : isDragActive ? 'Отпустите файл...' : 'Перетащите CSV или Excel'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB`
                : 'Поддерживаются .csv и .xlsx — ФИО, год, специальность, номер диплома'}
            </p>
          </div>
        </div>
      )}

      {/* Upload button */}
      {file && !jobId && (
        <div className="flex gap-2">
          <Button
            onClick={() => upload(file)}
            disabled={isUploading}
            className="flex-1 rounded-none bg-primary font-mono text-[10px] tracking-widest uppercase text-primary-foreground hover:opacity-90"
          >
            {isUploading ? (
              <Loader2 size={13} className="mr-2 animate-spin" />
            ) : (
              <Upload size={13} className="mr-2" />
            )}
            {isUploading ? 'Загружаем...' : 'Загрузить реестр'}
          </Button>
          <Button variant="outline" onClick={reset} className="rounded-none">
            Отмена
          </Button>
        </div>
      )}

      {/* Job status */}
      {job && (
        <div className="flex flex-col gap-3 border border-border/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusIcon[job.status]}
              <span className="font-mono text-xs font-medium tracking-wide text-foreground">
                {statusLabel[job.status]}
              </span>
            </div>
            {isDone && (
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase transition-colors hover:text-muted-foreground"
              >
                Загрузить ещё
              </button>
            )}
          </div>

          {job.total != null && (
            <div className="grid grid-cols-3 gap-3 border-t border-border/20 pt-3">
              <div className="flex flex-col gap-0.5 text-center">
                <span className="font-mono text-lg font-black text-foreground">{job.total}</span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Строк</span>
              </div>
              <div className="flex flex-col gap-0.5 text-center">
                <span className="font-mono text-lg font-black text-green-400">{job.imported}</span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Загружено</span>
              </div>
              <div className="flex flex-col gap-0.5 text-center">
                <span className={cn('font-mono text-lg font-black', job.failed > 0 ? 'text-red-400' : 'text-muted-foreground')}>
                  {job.failed}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Ошибок</span>
              </div>
            </div>
          )}

          {!isDone && (
            <div className="h-px w-full overflow-hidden bg-border/20">
              <div className="h-full animate-pulse bg-primary/40" />
            </div>
          )}
        </div>
      )}

      {/* Row errors */}
      {errorsData && errorsData.errors.length > 0 && (
        <Alert variant="destructive" className="rounded-none border-red-400/30 bg-red-400/8">
          <AlertDescription>
            <div className="flex flex-col gap-1 text-xs">
              {errorsData.errors.slice(0, 5).map((e, i) => (
                <span key={i}>Строка {e.row}: {e.message}</span>
              ))}
              {errorsData.errors.length > 5 && (
                <span>...и ещё {errorsData.errors.length - 5} ошибок</span>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Format hint */}
      {!jobId && (
        <div className="bg-muted/50 p-3">
          <p className="mb-1 text-xs font-medium text-foreground">Формат CSV/Excel:</p>
          <p className="font-mono text-xs text-muted-foreground">ФИО, номер_диплома, специальность, год_выпуска</p>
          <p className="mt-1 text-xs text-muted-foreground">Первая строка — заголовки, разделитель — запятая или точка с запятой</p>
        </div>
      )}
    </div>
  )
}
