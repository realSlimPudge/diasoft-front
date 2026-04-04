import { cn } from '@/shared/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  reverse?: boolean
}

export function Marquee({ children, className, duration = 30, reverse = false }: MarqueeProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className="flex w-max"
        style={{
          animation: `marquee-left ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
