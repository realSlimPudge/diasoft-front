import { motion } from 'motion/react'
import { Upload, List } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { CsvUploader } from '@/features/university-upload/ui/CsvUploader'
import { DiplomasTable } from '@/features/university-diplomas/ui/DiplomasTable'
import { useAuth } from '@/entities/auth/lib/use-auth'

export function UniversityPage() {
  const { user } = useAuth()

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 py-12">

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 left-0 h-[400px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
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
            — Кабинет ВУЗа
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">
            РЕЕСТР<br />ДИПЛОМОВ
          </h1>
          {(user?.organizationCode ?? user?.name) && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">
              {user?.organizationCode ?? user?.name}
            </p>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Tabs defaultValue="diplomas">
          <TabsList className="mb-8">
            <TabsTrigger value="diplomas">
              <List size={13} />
              Реестр
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload size={13} />
              Загрузить
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diplomas" className="mt-0">
            <p className="mb-6 text-sm text-muted-foreground">
              Управляйте записями о выданных дипломах
            </p>
            <DiplomasTable />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="mx-auto max-w-xl">
              <p className="mb-6 text-sm text-muted-foreground">
                Массовая загрузка данных из CSV или Excel файла
              </p>
              <CsvUploader />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
