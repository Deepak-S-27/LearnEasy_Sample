import jwt from "jsonwebtoken"

export const AUTH_COOKIE_NAME = "learneasy_token"

export function cookieBaseOptions() {
  const isProd = process.env.NODE_ENV === "production"
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (minimum 16 characters)")
  }
  return secret
}

export function signAuthToken(payload: {
  sub: string
  email: string
  name: string
  role?: "student" | "mentor"
}): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
    algorithm: "HS256",
  })
}

export type AuthJwtPayload = {
  sub: string
  email: string
  name: string
  role?: "student" | "mentor"
  iat?: number
  exp?: number
}

export function verifyAuthToken(token: string): AuthJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthJwtPayload
    if (!decoded.sub || !decoded.email) return null
    return decoded
  } catch {
    return null
  }
}
