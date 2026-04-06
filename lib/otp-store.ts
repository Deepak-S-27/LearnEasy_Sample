/**
 * In-memory OTP store. For production, use Redis or a database.
 * OTPs expire after 10 minutes.
 */

const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

export type OtpPurpose = "login" | "signup" | "forgot_password"

interface OtpRecord {
  otp: string
  email: string
  purpose: OtpPurpose
  expiresAt: number
  metadata?: Record<string, unknown>
}

const store = new Map<string, OtpRecord>()

function makeKey(email: string, purpose: OtpPurpose): string {
  return `${purpose}:${email.toLowerCase().trim()}`
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function createOtp(
  email: string,
  purpose: OtpPurpose,
  metadata?: Record<string, unknown>
): string {
  const key = makeKey(email, purpose)
  const otp = generateOtp()
  store.set(key, {
    otp,
    email: email.toLowerCase().trim(),
    purpose,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    metadata,
  })
  return otp
}

export function verifyOtp(
  email: string,
  otp: string,
  purpose: OtpPurpose
): { valid: boolean; metadata?: Record<string, unknown> } {
  const key = makeKey(email, purpose)
  const record = store.get(key)
  if (!record) {
    return { valid: false }
  }
  if (Date.now() > record.expiresAt) {
    store.delete(key)
    return { valid: false }
  }
  if (record.otp !== otp.trim()) {
    return { valid: false }
  }
  store.delete(key)
  return { valid: true, metadata: record.metadata }
}

export function invalidateOtp(email: string, purpose: OtpPurpose): void {
  store.delete(makeKey(email, purpose))
}
