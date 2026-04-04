import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CursorGlow() {
  const rawX = useMotionValue(-800)
  const rawY = useMotionValue(-800)

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute"
        style={{
          left: x,
          top: y,
          width: 700,
          height: 700,
          x: '-50%',
          y: '-50%',
          background:
            'radial-gradient(circle, oklch(0.55 0.22 264 / 0.13) 0%, oklch(0.55 0.22 264 / 0.06) 35%, transparent 70%)',
        }}
      />
    </div>
  )
}
