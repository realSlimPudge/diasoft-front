import { GraduationCap, Hash, User, BookOpen, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { VerdictBadge } from './VerdictBadge'
import type { VerificationResult } from '@/entities/diploma/api/dto/diploma.types'

interface VerificationCardProps {
  result: VerificationResult
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon size={15} className="text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}

export function VerificationCard({ result }: VerificationCardProps) {
  const isValid = result.verdict === 'valid'

  return (
    <Card className={`w-full max-w-lg overflow-hidden ${isValid ? 'border-green-200 dark:border-green-800' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-full ${isValid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted'}`}>
            <Shield size={20} className={isValid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Результат верификации</span>
            <VerdictBadge verdict={result.verdict} size="md" />
          </div>
        </div>
      </CardHeader>

      {(result.diplomaNumber || result.universityCode || result.ownerNameMask || result.program) && (
        <>
          <Separator />
          <CardContent className="flex flex-col gap-4 pt-4">
            <InfoRow icon={Hash} label="Номер диплома" value={result.diplomaNumber} />
            <InfoRow icon={GraduationCap} label="Университет" value={result.universityCode} />
            <InfoRow icon={User} label="Владелец" value={result.ownerNameMask} />
            <InfoRow icon={BookOpen} label="Программа" value={result.program} />
          </CardContent>
        </>
      )}
    </Card>
  )
}
