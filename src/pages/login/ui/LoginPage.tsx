import { motion } from 'motion/react'
import { LoginForm } from '@/features/auth/ui/LoginForm'

const lines = ['ВХОД', 'В', 'СИСТЕМУ']

const stats = [
  { value: '500K+', label: 'поддельных\nдипломов в год' },
  { value: '40%', label: 'работодателей\nне проверяют' },
  { value: '<1с', label: 'время\nверификации' },
  { value: '250+', label: 'ВУЗов\nможно подключить' },
]

export function LoginPage() {
  return (
    <div className="relative grid min-h-[calc(100svh-57px)] grid-cols-1 lg:grid-cols-[1fr_480px]">

      {/* LEFT — kinetic typography */}
      <div className="relative hidden flex-col justify-between overflow-hidden px-12 py-16 lg:flex">

        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[120px]" />
        </div>

        {/* Big text */}
        <div className="relative flex-1 flex flex-col justify-center">
          <h1 className="leading-[0.88] tracking-tight" aria-label="Вход в систему">
            {lines.map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.div
                  className="font-black"
                  style={{ fontSize: 'clamp(4rem,8.5vw,7.5rem)' }}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.14,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-xs text-sm leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Единая платформа верификации дипломов для ВУЗов, HR-специалистов и выпускников.
          </motion.p>
        </div>

        {/* Stats — no cards, raw numbers */}
        <motion.div
          className="grid grid-cols-4 gap-0 border-t border-border/30 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={value}
              className="flex flex-col gap-1.5 pr-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.08, duration: 0.5 }}
            >
              <span
                className="font-black leading-none text-foreground"
                style={{ fontSize: 'clamp(1.5rem,2.5vw,2.2rem)' }}
              >
                {value}
              </span>
              <span className="whitespace-pre-line font-mono text-[9px] leading-tight tracking-wide text-muted-foreground/60 uppercase">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative vertical line */}
        <div className="absolute right-0 top-0 h-full w-px bg-border/30" />
      </div>

      {/* RIGHT — form */}
      <div className="flex items-center justify-center px-6 py-16 lg:px-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <p className="mb-8 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            — Авторизация
          </p>
          <LoginForm />
        </motion.div>
      </div>
    </div>
  )
}
