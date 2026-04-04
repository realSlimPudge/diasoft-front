import { createFileRoute } from '@tanstack/react-router'
import { UniversityPage } from '@/pages/university/ui/UniversityPage'

export const Route = createFileRoute('/university')({
  component: UniversityPage,
})
