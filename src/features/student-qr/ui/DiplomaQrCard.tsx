import { QRCodeSVG } from 'qrcode.react'
import { Shield, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { VerdictBadge } from '@/features/verification-result/ui/VerdictBadge'
import type { StudentDiploma } from '@/entities/student-diploma/api/dto/student.types'

interface DiplomaQrCardProps {
  diploma: StudentDiploma
}

export function DiplomaQrCard({ diploma }: DiplomaQrCardProps) {
  const verifyUrl = `${window.location.origin}/v/${diploma.verificationToken}`

  const handleDownload = () => {
    const svg = document.getElementById('diploma-qr-svg')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `diploma-qr-${diploma.diplomaNumber}.svg`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{diploma.diplomaNumber}</p>
            <p className="text-sm text-muted-foreground">{diploma.universityCode}</p>
          </div>
        </div>
        <VerdictBadge
          verdict={diploma.status === 'active' ? 'valid' : diploma.status === 'revoked' ? 'revoked' : 'expired'}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border bg-white p-4">
          <QRCodeSVG
            id="diploma-qr-svg"
            value={verifyUrl}
            size={200}
            level="H"
            includeMargin={false}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{diploma.program}</p>
          <p className="text-xs text-muted-foreground">{diploma.graduationYear} год выпуска</p>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground mb-1">Ссылка верификации</p>
        <p className="text-xs font-mono text-foreground break-all">{verifyUrl}</p>
      </div>

      <Button variant="outline" onClick={handleDownload}>
        <Download size={14} data-icon="inline-start" />
        Скачать QR-код
      </Button>
    </div>
  )
}
