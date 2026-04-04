import { createRootRoute } from '@tanstack/react-router'
import { AppLayout } from '@/shared/components/layout/AppLayout'

export const Route = createRootRoute({
  component: AppLayout,
})
