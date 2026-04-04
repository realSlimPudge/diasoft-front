import { VerifyHero } from '@/widgets/verify-hero/ui/VerifyHero'
import { VerifyForm } from '@/features/verify-by-form/ui/VerifyForm'
import { Separator } from '@/shared/components/ui/separator'

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12">
      <VerifyHero />

      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">Проверить диплом</h2>
            <p className="text-sm text-muted-foreground">
              Введите номер диплома и код университета для мгновенной проверки подлинности
            </p>
          </div>
          <Separator className="mb-6" />
          <VerifyForm />
        </div>
      </div>

      <HowItWorks />
    </div>
  )
}

function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Введите данные',
      description: 'Укажите номер диплома и код университета — эти данные указаны на документе.',
    },
    {
      step: '02',
      title: 'Запрос в реестр',
      description: 'Система обращается к официальному реестру документов об образовании.',
    },
    {
      step: '03',
      title: 'Получите результат',
      description: 'Мгновенно получайте статус: действителен, аннулирован, истёк срок или не найден.',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Как это работает</h2>
        <p className="mt-1 text-sm text-muted-foreground">Три простых шага для проверки документа</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(({ step, title, description }) => (
          <div key={step} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <span className="text-3xl font-black text-primary/20">{step}</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
