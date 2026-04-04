import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface AnimatedTextProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}

export function AnimatedText({ children, className, delay = 0, stagger = 0.06, once = true }: AnimatedTextProps) {
  const words = children.split(' ')

  return (
    <span className={cn('inline', className)} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ perspective: '400px' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0, rotateX: -15 }}
            whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once }}
            transition={{ delay: delay + i * stagger, duration: 0.7, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

interface AnimatedCharsProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}

export function AnimatedChars({ children, className, delay = 0, stagger = 0.03, once = true }: AnimatedCharsProps) {
  const chars = children.split('')

  return (
    <span className={cn('inline-flex', className)} aria-label={children}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once }}
            transition={{ delay: delay + i * stagger, duration: 0.5, ease: EASE }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
