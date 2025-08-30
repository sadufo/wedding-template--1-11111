import { requireAuth } from "@/lib/auth"
import { RSVPManager } from "@/components/admin/rsvp-manager"

export default async function AdminRSVPPage() {
  const user = await requireAuth()

  return <RSVPManager user={user} />
}
