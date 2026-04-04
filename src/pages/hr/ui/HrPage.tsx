import { Briefcase, LogOut, ScanLine, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { QrScanner } from '@/features/hr-scanner/ui/QrScanner'
import { VerifyForm } from '@/features/verify-by-form/ui/VerifyForm'
import { useAuth } from '@/entities/auth/lib/use-auth'
import { useRouter } from '@tanstack/react-router'

export function HrPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">HR-портал</h1>
            <p className="text-sm text-muted-foreground">{user?.name ?? 'Проверка кандидатов'}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={14} data-icon="inline-start" />
          Выйти
        </Button>
      </div>

      <Separator className="mb-8" />

      <Tabs defaultValue="manual">
        <TabsList className="mb-6">
          <TabsTrigger value="manual">
            <Search size={14} data-icon="inline-start" />
            По номеру диплома
          </TabsTrigger>
          <TabsTrigger value="scan">
            <ScanLine size={14} data-icon="inline-start" />
            Сканировать QR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="flex flex-col gap-3">
            <div className="mb-2">
              <h2 className="text-base font-medium text-foreground">Ручная проверка</h2>
              <p className="text-sm text-muted-foreground">Введите данные из резюме кандидата для мгновенной верификации</p>
            </div>
            <VerifyForm />
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <div className="flex flex-col gap-3">
            <div className="mb-2">
              <h2 className="text-base font-medium text-foreground">Сканирование QR-кода</h2>
              <p className="text-sm text-muted-foreground">Сканируйте QR-код из резюме или цифрового диплома кандидата</p>
            </div>
            <QrScanner />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
