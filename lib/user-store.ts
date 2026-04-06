/**
 * In-memory user store for development.
 * Replace with a database (e.g. Prisma, Drizzle) for production.
 */

export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: number
}

const users = new Map<string, StoredUser>()

function hashPassword(password: string): string {
  // Simple hash for dev. Use bcrypt or argon2 in production.
  let h = 0
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i)
    h |= 0
  }
  return `dev_${h.toString(16)}`
}

export function createUser(
  name: string,
  email: string,
  password: string
): StoredUser {
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const user: StoredUser = {
    id,
    name,
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  }
  users.set(user.email, user)
  return user
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase().trim())
}

export function updatePassword(email: string, newPassword: string): boolean {
  const user = users.get(email.toLowerCase().trim())
  if (!user) return false
  user.passwordHash = hashPassword(newPassword)
  return true
}

export function verifyPassword(user: StoredUser, password: string): boolean {
  return user.passwordHash === hashPassword(password)
}
