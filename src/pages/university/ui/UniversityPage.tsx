import { Upload, List, GraduationCap, LogOut } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { CsvUploader } from '@/features/university-upload/ui/CsvUploader'
import { DiplomasTable } from '@/features/university-diplomas/ui/DiplomasTable'
import { useAuth } from '@/entities/auth/lib/use-auth'
import { useRouter } from '@tanstack/react-router'

export function UniversityPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Кабинет ВУЗа</h1>
            <p className="text-sm text-muted-foreground">{user?.organizationCode ?? user?.name}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={14} data-icon="inline-start" />
          Выйти
        </Button>
      </div>

      <Separator className="mb-8" />

      <Tabs defaultValue="diplomas">
        <TabsList className="mb-6">
          <TabsTrigger value="diplomas">
            <List size={14} data-icon="inline-start" />
            Реестр дипломов
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload size={14} data-icon="inline-start" />
            Загрузить реестр
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diplomas">
          <div className="flex flex-col gap-2">
            <div className="mb-2">
              <h2 className="text-base font-medium text-foreground">Реестр дипломов</h2>
              <p className="text-sm text-muted-foreground">Управляйте записями о выданных дипломах</p>
            </div>
            <DiplomasTable />
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="mx-auto max-w-xl flex flex-col gap-2">
            <div className="mb-2">
              <h2 className="text-base font-medium text-foreground">Загрузка реестра</h2>
              <p className="text-sm text-muted-foreground">Массовая загрузка данных о дипломах из CSV или Excel файла</p>
            </div>
            <CsvUploader />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
