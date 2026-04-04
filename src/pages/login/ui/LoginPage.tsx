import { Shield } from 'lucide-react'
import { LoginForm } from '@/features/auth/ui/LoginForm'

export function LoginPage() {
  return (
    <div className="grid min-h-[calc(100svh-56px)] lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Shield size={16} className="text-primary-foreground" />
          </div>
          <span className="font-semibold">DiaSoft Verify</span>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold leading-tight">
            Доверие к образованию<br />в один клик
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Единая платформа верификации дипломов для ВУЗов, работодателей и выпускников.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '500 000+', label: 'поддельных дипломов в год в России' },
            { value: '40%', label: 'работодателей не проверяют образование' },
            { value: '<1 сек', label: 'время верификации через платформу' },
            { value: '250+', label: 'ВУЗов могут подключиться' },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl bg-primary-foreground/10 p-4">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-primary-foreground/60 leading-tight mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  )
}
