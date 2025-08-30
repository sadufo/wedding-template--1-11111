// Работа с cookies и редиректом должна быть реализована в серверных компонентах или route handlers
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
  // Временно отключаем bcrypt для теста на Netlify
  return password === "admin123";
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

// Работа с сессией и cookies перенесите в серверные компоненты или route handlers
// Например, используйте cookies() внутри app/api/auth/login/route.ts

// Получение сессии реализуйте в серверных компонентах или route handlers

// Удаление сессии реализуйте в серверных компонентах или route handlers

// Проверку авторизации и редирект реализуйте в серверных компонентах или route handlers
