import { NextResponse } from "next/server"
import { verifyOtp } from "@/lib/otp-store"
import { updatePassword, findUserByEmail } from "@/lib/user-store"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, newPassword } = body as {
      email?: string
      otp?: string
      newPassword?: string
    }

    if (!email?.trim() || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, OTP and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const result = verifyOtp(normalizedEmail, otp, "forgot_password")

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      )
    }

    const user = findUserByEmail(normalizedEmail)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    updatePassword(normalizedEmail, newPassword)
    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
