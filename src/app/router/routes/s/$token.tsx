import { createFileRoute } from '@tanstack/react-router'
import { ShareLinkPage } from '@/pages/share-link/ui/ShareLinkPage'

export const Route = createFileRoute('/s/$token')({
  component: function ShareLinkRoute() {
    const { token } = Route.useParams()
    return <ShareLinkPage token={token} />
  },
})
