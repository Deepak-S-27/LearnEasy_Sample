import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth-token"

/** Returns JWT subject (Mongo User id) when the auth cookie is valid. */
export async function getSessionUserId(): Promise<string | null> {
  try {
    const store = await cookies()
    const token = store.get(AUTH_COOKIE_NAME)?.value
    if (!token) return null
    const payload = verifyAuthToken(token)
    return payload?.sub ?? null
  } catch {
    return null
  }
}
