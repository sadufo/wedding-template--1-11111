
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
// import { Session } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import AdminPanelContent from "@/components/admin/AdminPanelContent"

import { Session, User } from "@/lib/auth"
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

export default function AdminPage() {
  // Переход на асинхронную функцию
  // В серверных компонентах Next.js можно использовать async/await
  return (async () => {
    const user = await getUserFromCookies();
    if (!user) {
      redirect("/admin/login");
      return null;
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader user={user} />
        <AdminPanelContent user={user} />
      </div>
    );
  })();
}
