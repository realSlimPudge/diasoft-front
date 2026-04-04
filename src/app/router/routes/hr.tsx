import { createFileRoute } from '@tanstack/react-router'
import { HrPage } from '@/pages/hr/ui/HrPage'

export const Route = createFileRoute('/hr')({
  component: HrPage,
})
