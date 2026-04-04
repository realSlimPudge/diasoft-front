import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Marquee } from '@/shared/components/ui/marquee'
import { AnimatedText } from '@/shared/components/ui/animated-text'
import { InlineVerdict } from '@/features/verification-result/ui/InlineVerdict'
import { diplomaOptions } from '@/entities/diploma/api/diploma.options'
import type { VerificationResult } from '@/entities/diploma/api/dto/diploma.types'

const tickerItems = [
  '1 МЛН+ ВЕРИФИКАЦИЙ',
  '250+ УНИВЕРСИТЕТОВ',
  '< 1 СЕК НА ПРОВЕРКУ',
  '10 000+ РАБОТОДАТЕЛЕЙ',
  'РЕЕСТР МИНОБРАЗОВАНИЯ',
  'МГНОВЕННЫЙ РЕЗУЛЬТАТ',
]

const steps = [
  {
    num: '01',
    title: 'Введите данные',
    body: 'Номер диплома и код университета — два поля, никаких лишних шагов.',
  },
  {
    num: '02',
    title: 'Запрос в реестр',
    body: 'Система обращается к официальной базе в режиме реального времени.',
  },
  {
    num: '03',
    title: 'Результат',
    body: 'Действителен, аннулирован или не найден — мгновенно и без лишнего.',
  },
]

export function HomePage() {
  const [diplomaNumber, setDiplomaNumber] = useState('')
  const [universityCode, setUniversityCode] = useState('')
  const [result, setResult] = useState<VerificationResult | null>(null)

  const { mutate, isPending } = useMutation({
    ...diplomaOptions.verifyByForm(),
    onSuccess: (data) => setResult(data),
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!diplomaNumber.trim() || !universityCode.trim()) return
    setResult(null)
    mutate({ diplomaNumber: diplomaNumber.trim(), universityCode: universityCode.trim() })
  }

  return (
    <div className="relative">

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-[92vh] px-6 pt-14 pb-0 lg:px-12">

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 left-[30%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[140px]" />
          <div className="absolute bottom-0 right-[10%] h-[400px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-[1fr_400px] lg:gap-24">

          {/* LEFT — kinetic headline */}
          <div className="flex flex-col justify-center pb-16 pt-8 lg:pb-0 lg:pt-16">

            <motion.div
              className="mb-8 inline-flex w-fit items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Верификация документов об образовании
              </span>
            </motion.div>

            {/* Each line pops out of overflow-hidden container */}
            <h1 className="mb-8 leading-[0.9] tracking-tight" aria-label="Верификация дипломов">
              {(['ВЕРИФИ-', 'КАЦИЯ', 'ДИПЛО-', 'МОВ'] as const).map((line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.div
                    className="font-black"
                    style={{
                      fontSize: 'clamp(3rem,9.5vw,8rem)',
                      color: i >= 2 ? 'oklch(0.68 0.18 264)' : undefined,
                    }}
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.12,
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
              className="max-w-xs text-sm leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Прямой запрос в официальный реестр. Никакого кэша, никаких посредников.
            </motion.p>
          </div>

          {/* RIGHT — form, raw (no card) */}
          <div className="flex items-center lg:items-start lg:pt-[7rem]">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-7 font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                — проверить диплом
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/50 uppercase">
                    Номер диплома
                  </span>
                  <Input
                    placeholder="D-2026-0001"
                    value={diplomaNumber}
                    onChange={(e) => setDiplomaNumber(e.target.value)}
                    disabled={isPending}
                    required
                    className="rounded-none border-0 border-b border-border/50 bg-transparent px-0 py-2.5 text-sm placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/50 uppercase">
                    Код университета
                  </span>
                  <Input
                    placeholder="ITMO"
                    value={universityCode}
                    onChange={(e) => setUniversityCode(e.target.value)}
                    disabled={isPending}
                    required
                    className="rounded-none border-0 border-b border-border/50 bg-transparent px-0 py-2.5 text-sm placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:outline-none transition-colors"
                  />
                </label>

                <div className="pt-1">
                  <Button
                    type="submit"
                    disabled={isPending || !diplomaNumber || !universityCode}
                    className="group w-full rounded-none bg-primary py-6 font-mono text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-25"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={13} className="animate-spin" />
                        ПРОВЕРЯЕМ
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        ПРОВЕРИТЬ ДИПЛОМ
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5"
                >
                  <InlineVerdict result={result} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ticker ──────────────────────────────────────── */}
      <div className="relative z-10 border-y border-border/30 py-3">
        <Marquee duration={32} className="text-muted-foreground/40">
          {tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-5 font-mono text-[10px] tracking-[0.18em]">
              <span className="opacity-40">·</span>
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── How it works ────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <div className="mb-16">
          <AnimatedText className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            — Как это работает
          </AnimatedText>
        </div>

        <div className="flex flex-col">
          {steps.map(({ num, title, body }, i) => (
            <motion.div
              key={num}
              className="group grid grid-cols-[56px_1fr] gap-8 border-t border-border/30 py-10 lg:grid-cols-[100px_260px_1fr]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-3xl font-black text-muted-foreground/15 transition-colors group-hover:text-primary/25 lg:text-4xl">
                {num}
              </span>
              <h3 className="self-center text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="self-center text-sm leading-relaxed text-muted-foreground lg:max-w-md">
                {body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-border/30" />
        </div>
      </section>
    </div>
  )
}
