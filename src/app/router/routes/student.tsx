import { createFileRoute } from '@tanstack/react-router'
import { StudentPage } from '@/pages/student/ui/StudentPage'

export const Route = createFileRoute('/student')({
  component: StudentPage,
})
