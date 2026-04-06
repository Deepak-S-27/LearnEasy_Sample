import { NextResponse } from "next/server"
import { createOtp } from "@/lib/otp-store"
import { sendOtpEmail } from "@/lib/email"
import { findUserByEmail } from "@/lib/user-store"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email?.trim() || "")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, purpose, signupData } = body as {
      email?: string
      purpose?: "login" | "signup" | "forgot_password"
      signupData?: { name: string; password: string }
    }

    if (!email || !purpose) {
      return NextResponse.json(
        { success: false, error: "Email and purpose are required" },
        { status: 400 }
      )
    }

    if (purpose === "signup" && (!signupData?.name?.trim() || !signupData?.password)) {
      return NextResponse.json(
        { success: false, error: "Name and password required for signup" },
        { status: 400 }
      )
    }

    if (!["login", "signup", "forgot_password"].includes(purpose)) {
      return NextResponse.json(
        { success: false, error: "Invalid purpose" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      )
    }

    // For login and forgot_password, email must be registered
    if (purpose === "login" || purpose === "forgot_password") {
      const user = findUserByEmail(normalizedEmail)
      if (!user) {
        return NextResponse.json(
          { success: false, error: "No account found with this email" },
          { status: 404 }
        )
      }
    }

    // For signup, email must NOT already be registered
    if (purpose === "signup") {
      const existing = findUserByEmail(normalizedEmail)
      if (existing) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 409 }
        )
      }
    }

    const metadata =
      purpose === "signup" && signupData
        ? { name: signupData.name.trim(), password: signupData.password }
        : undefined

    const otp = createOtp(normalizedEmail, purpose, metadata)
    const result = await sendOtpEmail(normalizedEmail, otp, purpose)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send OTP" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
