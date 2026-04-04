import { motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Shield } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { StudentDiploma } from '@/entities/student-diploma/api/dto/student.types'

interface DiplomaQrCardProps {
  diploma: StudentDiploma
}

const statusLabel: Record<StudentDiploma['status'], { text: string; color: string }> = {
  active: { text: 'ДЕЙСТВИТЕЛЕН', color: 'text-emerald-400' },
  revoked: { text: 'АННУЛИРОВАН', color: 'text-red-400' },
  expired: { text: 'ИСТЁК СРОК', color: 'text-amber-400' },
}

export function DiplomaQrCard({ diploma }: DiplomaQrCardProps) {
  const verifyUrl = `${window.location.origin}/v/${diploma.verificationToken}`
  const status = statusLabel[diploma.status]

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-0 border border-border/40 sm:grid-cols-[200px_1fr]"
    >
      {/* QR area */}
      <div className="flex items-center justify-center border-b border-border/40 bg-white/5 p-8 sm:border-b-0 sm:border-r">
        <QRCodeSVG
          id="diploma-qr-svg"
          value={verifyUrl}
          size={160}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="oklch(0.97 0 0)"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-6">
        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Shield size={12} className={status.color} />
            <span className={`font-mono text-[10px] font-semibold tracking-widest ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Fields */}
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Номер</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold">{diploma.diplomaNumber}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Университет</dt>
              <dd className="mt-0.5 font-mono text-sm">{diploma.universityCode}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Программа</dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">{diploma.program}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">Год выпуска</dt>
              <dd className="mt-0.5 font-mono text-sm">{diploma.graduationYear}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="w-full rounded-none border-border/40 font-mono text-[10px] tracking-widest uppercase"
          >
            <Download size={12} className="mr-2" />
            Скачать QR
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
