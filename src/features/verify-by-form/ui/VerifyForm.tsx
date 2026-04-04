import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { VerificationCard } from '@/features/verification-result/ui/VerificationCard'
import { diplomaOptions } from '@/entities/diploma/api/diploma.options'
import type { VerificationResult } from '@/entities/diploma/api/dto/diploma.types'

export function VerifyForm() {
  const [diplomaNumber, setDiplomaNumber] = useState('')
  const [universityCode, setUniversityCode] = useState('')
  const [result, setResult] = useState<VerificationResult | null>(null)

  const { mutate, isPending } = useMutation({
    ...diplomaOptions.verifyByForm(),
    onSuccess: (data) => {
      setResult(data)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!diplomaNumber.trim() || !universityCode.trim()) return
    setResult(null)
    mutate({ diplomaNumber: diplomaNumber.trim(), universityCode: universityCode.trim() })
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="diplomaNumber">Номер диплома</Label>
            <Input
              id="diplomaNumber"
              placeholder="D-2026-0001"
              value={diplomaNumber}
              onChange={(e) => setDiplomaNumber(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="universityCode">Код университета</Label>
            <Input
              id="universityCode"
              placeholder="ITMO"
              value={universityCode}
              onChange={(e) => setUniversityCode(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending || !diplomaNumber || !universityCode} className="w-full sm:w-auto">
          {isPending ? (
            <Loader2 size={15} className="animate-spin" data-icon="inline-start" />
          ) : (
            <Search size={15} data-icon="inline-start" />
          )}
          {isPending ? 'Проверяем...' : 'Проверить диплом'}
        </Button>
      </form>

      {result && (
        <div className="flex justify-center">
          <VerificationCard result={result} />
        </div>
      )}
    </div>
  )
}
