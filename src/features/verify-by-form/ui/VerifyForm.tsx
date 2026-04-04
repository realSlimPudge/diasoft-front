import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { InlineVerdict } from '@/features/verification-result/ui/InlineVerdict'
import { diplomaOptions } from '@/entities/diploma/api/diploma.options'
import type { VerificationResult } from '@/entities/diploma/api/dto/diploma.types'

export function VerifyForm() {
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
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
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
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
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
        </div>

        <Button
          type="submit"
          disabled={isPending || !diplomaNumber || !universityCode}
          className="group w-full rounded-none bg-primary py-5 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-25 sm:w-auto sm:px-8"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={13} className="animate-spin" />
              ПРОВЕРЯЕМ
            </span>
          ) : (
            <span className="flex items-center gap-2">
              ПРОВЕРИТЬ
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <InlineVerdict result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
