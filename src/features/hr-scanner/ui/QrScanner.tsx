import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Camera, CameraOff, ScanLine } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/shared/components/ui/button'
import { VerificationCard } from '@/features/verification-result/ui/VerificationCard'
import { diplomaApi } from '@/entities/diploma/api/diploma.api'
import { diplomaKeys } from '@/entities/diploma/api/diploma.keys'
import { cn } from '@/shared/lib/utils'

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedToken, setScannedToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerId = 'qr-scanner-container'

  const { data: result, isPending } = useQuery({
    queryKey: scannedToken ? diplomaKeys.byToken(scannedToken) : ['disabled'],
    queryFn: () => diplomaApi.verifyByToken(scannedToken!),
    enabled: !!scannedToken,
  })

  const startScanner = async () => {
    try {
      setError(null)
      setScannedToken(null)
      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Extract token from URL like /v/{token}
          const match = decodedText.match(/\/v\/([^/?#]+)/)
          const token = match ? match[1] : decodedText
          stopScanner()
          setScannedToken(token)
        },
        () => { /* ignore scan failures */ },
      )
      setIsScanning(true)
    } catch {
      setError('Нет доступа к камере. Проверьте разрешения браузера.')
    }
  }

  const stopScanner = () => {
    scannerRef.current?.stop().catch(() => {})
    scannerRef.current = null
    setIsScanning(false)
  }

  useEffect(() => () => { stopScanner() }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Scanner viewport */}
      <div className="relative overflow-hidden rounded-2xl border bg-muted">
        <div
          id={containerId}
          className={cn('w-full', isScanning ? 'block' : 'hidden')}
        />
        {!isScanning && (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <ScanLine size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Сканирование QR-кода</p>
              <p className="text-sm text-muted-foreground">Направьте камеру на QR-код из резюме кандидата</p>
            </div>
          </div>
        )}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-52 rounded-xl border-2 border-primary shadow-lg" />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanner} className="flex-1">
            <Camera size={15} data-icon="inline-start" />
            Запустить камеру
          </Button>
        ) : (
          <Button variant="outline" onClick={stopScanner} className="flex-1">
            <CameraOff size={15} data-icon="inline-start" />
            Остановить
          </Button>
        )}
        {(scannedToken || result) && (
          <Button variant="ghost" onClick={() => { setScannedToken(null) }}>
            Новое сканирование
          </Button>
        )}
      </div>

      {isPending && scannedToken && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <ScanLine size={16} className="animate-pulse text-primary" />
          <span className="text-sm text-muted-foreground">Проверяем диплом...</span>
        </div>
      )}

      {result && (
        <VerificationCard result={result} />
      )}
    </div>
  )
}
