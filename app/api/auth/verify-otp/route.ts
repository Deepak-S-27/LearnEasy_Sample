import { NextResponse } from "next/server"
import { verifyOtp } from "@/lib/otp-store"
import { findUserByEmail, createUser } from "@/lib/user-store"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, purpose } = body as {
      email?: string
      otp?: string
      purpose?: "login" | "signup" | "forgot_password"
    }

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { success: false, error: "Email, OTP and purpose are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const result = verifyOtp(normalizedEmail, otp, purpose)

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      )
    }

    if (purpose === "login") {
      const user = findUserByEmail(normalizedEmail)
      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        user: { name: user.name, email: user.email },
      })
    }

    if (purpose === "signup" && result.metadata) {
      const { name, password } = result.metadata as { name: string; password: string }
      if (name && password) {
        const user = createUser(name, normalizedEmail, password)
        return NextResponse.json({
          success: true,
          user: { name: user.name, email: user.email },
        })
      }
    }

    if (purpose === "forgot_password") {
      return NextResponse.json({
        success: true,
        message: "OTP verified. You can now reset your password.",
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
