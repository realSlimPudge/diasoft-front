import { createFileRoute } from '@tanstack/react-router'
import { VerifyTokenPage } from '@/pages/verify-token/ui/VerifyTokenPage'

export const Route = createFileRoute('/v/$token')({
  component: function VerifyByTokenRoute() {
    const { token } = Route.useParams()
    return <VerifyTokenPage token={token} />
  },
})
