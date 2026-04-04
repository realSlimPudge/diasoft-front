import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Verdict } from '@/entities/diploma/api/dto/diploma.types'

interface VerdictBadgeProps {
  verdict: Verdict
  size?: 'sm' | 'md' | 'lg'
}

const verdictConfig: Record<Verdict, {
  label: string
  icon: React.ElementType
  className: string
}> = {
  valid: {
    label: 'Действителен',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
  },
  revoked: {
    label: 'Аннулирован',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  expired: {
    label: 'Истёк срок',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  not_found: {
    label: 'Не найден',
    icon: HelpCircle,
    className: 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-700',
  },
}

const sizeClass = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
}

const iconSize = { sm: 12, md: 15, lg: 18 }

export function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = verdictConfig[verdict]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        sizeClass[size],
        config.className,
      )}
    >
      <Icon size={iconSize[size]} />
      {config.label}
    </span>
  )
}
