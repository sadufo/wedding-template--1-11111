import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Session, User } from "@/lib/auth"
import { RSVPManager } from "@/components/admin/rsvp-manager"

async function getUserFromCookies(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get?.("session");
  if (!sessionCookie) return null;
  const session: Session = JSON.parse(sessionCookie.value);
  if (new Date(session.expires) < new Date()) {
    return null;
  }
  return session.user;
}

export default async function AdminRSVPPage() {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/admin/login");
    return null;
  }
  return <RSVPManager user={user} />;
}
