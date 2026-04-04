import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { cn } from '@/shared/lib/utils'
import { registryApi } from '@/entities/diploma-registry/api/registry.api'
import { registryKeys } from '@/entities/diploma-registry/api/registry.keys'

export function CsvUploader() {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)

  const { mutate, isPending, data: result, reset } = useMutation({
    mutationFn: (f: File) => registryApi.uploadCsv(f),
    onSuccess: (data) => {
      toast.success(`Загружено ${data.imported} из ${data.total} записей`)
      queryClient.invalidateQueries({ queryKey: registryKeys.list() })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      reset()
    }
  }, [reset])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
    disabled: isPending,
  })

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          {file ? <FileSpreadsheet size={24} className="text-primary" /> : <Upload size={24} className="text-primary" />}
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            {file ? file.name : isDragActive ? 'Отпустите файл...' : 'Перетащите CSV или Excel'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {file
              ? `${(file.size / 1024).toFixed(1)} KB`
              : 'Поддерживаются .csv и .xlsx — ФИО, год, специальность, номер диплома'}
          </p>
        </div>
      </div>

      {file && !result && (
        <div className="flex gap-2">
          <Button onClick={() => mutate(file)} disabled={isPending} className="flex-1">
            {isPending ? <Loader2 size={15} className="animate-spin" data-icon="inline-start" /> : <Upload size={15} data-icon="inline-start" />}
            {isPending ? 'Загружаем...' : 'Загрузить реестр'}
          </Button>
          <Button variant="outline" onClick={() => { setFile(null); reset() }}>Отмена</Button>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Обработка записей...</span>
          </div>
          <Progress value={undefined} className="h-2" />
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-3 text-center">
              <div className="text-xl font-bold text-foreground">{result.total}</div>
              <div className="text-xs text-muted-foreground">Всего строк</div>
            </div>
            <div className="rounded-lg border bg-green-50 border-green-200 p-3 text-center dark:bg-green-950/20 dark:border-green-800">
              <div className="text-xl font-bold text-green-700 dark:text-green-400">{result.imported}</div>
              <div className="text-xs text-green-600 dark:text-green-500">Загружено</div>
            </div>
            <div className={cn('rounded-lg border p-3 text-center', result.failed > 0 ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' : 'bg-card')}>
              <div className={cn('text-xl font-bold', result.failed > 0 ? 'text-red-700 dark:text-red-400' : 'text-foreground')}>{result.failed}</div>
              <div className={cn('text-xs', result.failed > 0 ? 'text-red-600 dark:text-red-500' : 'text-muted-foreground')}>Ошибок</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="flex flex-col gap-1 text-xs">
                  {result.errors.slice(0, 5).map((e) => (
                    <span key={e.row}>Строка {e.row}: {e.message}</span>
                  ))}
                  {result.errors.length > 5 && <span>...и ещё {result.errors.length - 5} ошибок</span>}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button variant="outline" onClick={() => { setFile(null); reset() }}>
            <CheckCircle size={14} data-icon="inline-start" />
            Загрузить ещё
          </Button>
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-medium text-foreground mb-1">Формат CSV/Excel:</p>
        <p className="text-xs font-mono text-muted-foreground">ФИО, номер_диплома, специальность, год_выпуска</p>
        <p className="text-xs text-muted-foreground mt-1">Первая строка — заголовки, разделитель — запятая или точка с запятой</p>
      </div>
    </div>
  )
}
