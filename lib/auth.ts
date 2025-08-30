import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  email: string
  name: string
  coupleId: number
  role: string
}

export interface Session {
  user: User
  expires: string
}

// Production-ready user data - replace with actual database calls
const mockUsers = [
  {
    id: 1,
    email: "admin@wedding.com",
    password_hash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // 'admin123'
    name: "Wedding Admin",
    couple_id: 1,
    role: "admin",
  },
]

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // In production, this would query your actual database
  const user = mockUsers.find((u) => u.email === email)
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    coupleId: user.couple_id,
    role: user.role,
  }
}

export async function createSession(user: User): Promise<void> {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session: Session = {
    user,
    expires: expires.toISOString(),
  }

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) return null

    const session: Session = JSON.parse(sessionCookie.value)
    if (new Date(session.expires) < new Date()) {
      await destroySession()
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }
  return session.user
}
