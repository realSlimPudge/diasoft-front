import { motion } from 'motion/react'
import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { VerificationResult, Verdict } from '@/entities/diploma/api/dto/diploma.types'

interface InlineVerdictProps {
  result: VerificationResult
}

const config: Record<Verdict, { label: string; icon: React.ElementType; color: string; accent: string }> = {
  valid: {
    label: 'ДЕЙСТВИТЕЛЕН',
    icon: CheckCircle,
    color: 'text-emerald-400',
    accent: 'bg-emerald-400/8 border-emerald-400/20',
  },
  revoked: {
    label: 'АННУЛИРОВАН',
    icon: XCircle,
    color: 'text-red-400',
    accent: 'bg-red-400/8 border-red-400/20',
  },
  expired: {
    label: 'ИСТЁК СРОК',
    icon: Clock,
    color: 'text-amber-400',
    accent: 'bg-amber-400/8 border-amber-400/20',
  },
  not_found: {
    label: 'НЕ НАЙДЕН',
    icon: HelpCircle,
    color: 'text-muted-foreground',
    accent: 'bg-muted/20 border-border/40',
  },
}

export function InlineVerdict({ result }: InlineVerdictProps) {
  const { label, icon: Icon, color, accent } = config[result.verdict]

  const fields = [
    { label: 'НОМЕР', value: result.diplomaNumber },
    { label: 'УНИВЕРСИТЕТ', value: result.universityCode },
    { label: 'ВЛАДЕЛЕЦ', value: result.ownerNameMask },
    { label: 'ПРОГРАММА', value: result.program },
  ].filter((f) => f.value)

  return (
    <div className={cn('border px-5 py-4', accent)}>
      {/* Verdict row */}
      <div className="flex items-center gap-2.5 pb-3">
        <Icon size={15} className={color} />
        <span className={cn('font-mono text-xs font-semibold tracking-widest', color)}>
          {label}
        </span>
      </div>

      {/* Fields */}
      {fields.length > 0 && (
        <div className="border-t border-current/10 pt-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {fields.map(({ label: fl, value }, i) => (
              <motion.div
                key={fl}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <dt className="mb-0.5 font-mono text-[9px] tracking-widest text-muted-foreground/60">
                  {fl}
                </dt>
                <dd className="text-xs font-medium text-foreground">{value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
