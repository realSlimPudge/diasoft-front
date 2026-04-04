import { Shield, CheckCircle, Clock, Users } from 'lucide-react'

const stats = [
  { icon: CheckCircle, label: 'Верификаций выполнено', value: '1 млн+' },
  { icon: Shield, label: 'Университетов подключено', value: '250+' },
  { icon: Clock, label: 'Среднее время проверки', value: '<1 сек' },
  { icon: Users, label: 'Работодателей доверяют', value: '10 000+' },
]

export function VerifyHero() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Shield size={32} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Верификация дипломов
            <br />
            <span className="text-primary">за секунду</span>
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Мгновенно проверяйте подлинность документов об образовании.
            Надёжная система верификации для работодателей и кадровых служб.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 shadow-xs">
            <Icon size={18} className="text-primary" />
            <span className="text-xl font-bold text-foreground">{value}</span>
            <span className="text-center text-xs text-muted-foreground leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
