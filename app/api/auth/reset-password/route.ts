import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { hashPassword } from "@/lib/password"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    await connectDB()
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Set MONGODB_URI in your environment." },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { email, newPassword } = body as {
      email?: string
      newPassword?: string
    }

    if (!email?.trim() || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await UserModel.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      )
    }

    user.passwordHash = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
