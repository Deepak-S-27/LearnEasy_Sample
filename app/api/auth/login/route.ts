import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { verifyPassword } from "@/lib/password"
import { getMentorReview } from "@/lib/mentor-state"
import {
  AUTH_COOKIE_NAME,
  cookieBaseOptions,
  signAuthToken,
} from "@/lib/auth-token"

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
    const { email, password } = body as { email?: string; password?: string }

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await UserModel.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const role = user.role === "mentor" ? "mentor" : "student"
    let mentorReviewStatus:
      | "incomplete"
      | "pending"
      | "approved"
      | "rejected"
      | undefined
    let mentorRejectReason: string | null | undefined

    if (role === "mentor") {
      const m = await getMentorReview(user._id.toString())
      mentorReviewStatus = m.status
      mentorRejectReason = m.rejectReason
    }

    let token: string
    try {
      token = signAuthToken({
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
        role,
      })
    } catch {
      return NextResponse.json(
        { error: "Server misconfiguration: JWT_SECRET" },
        { status: 500 }
      )
    }

    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        classYear: user.classYear ?? undefined,
        role,
        ...(role === "mentor"
          ? {
              mentorReviewStatus,
              mentorRejectReason,
            }
          : {}),
      },
    })
    res.cookies.set(AUTH_COOKIE_NAME, token, cookieBaseOptions())
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
