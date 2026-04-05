import { motion } from 'motion/react'
import { ScanLine, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { QrScanner } from '@/features/hr-scanner/ui/QrScanner'
import { VerifyForm } from '@/features/verify-by-form/ui/VerifyForm'
import { useAuth } from '@/entities/auth/lib/use-auth'

export function HrPage() {
  const { user } = useAuth()

  return (
    <div className="relative mx-auto w-full max-w-3xl px-6 py-12">

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/4 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className="relative mb-12 flex items-end justify-between border-b border-border/30 pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            — HR-портал
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">
            ПРОВЕРКА<br />КАНДИДАТОВ
          </h1>
          {user?.name && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">{user.name}</p>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Tabs defaultValue="manual">
          <TabsList className="mb-8">
            <TabsTrigger value="manual">
              <Search size={13} />
              По номеру
            </TabsTrigger>
            <TabsTrigger value="scan">
              <ScanLine size={13} />
              QR-код
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-0">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Введите данные из резюме для мгновенной верификации
              </p>
            </div>
            <VerifyForm />
          </TabsContent>

          <TabsContent value="scan" className="mt-0">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Сканируйте QR-код из резюме или цифрового диплома
              </p>
            </div>
            <QrScanner />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
