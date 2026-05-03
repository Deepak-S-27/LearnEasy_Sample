import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth-token"
import { getMentorReview } from "@/lib/mentor-state"

export const runtime = "nodejs"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ user: null })
  }

  const payload = verifyAuthToken(token)
  if (!payload) {
    const res = NextResponse.json({ user: null })
    res.cookies.delete(AUTH_COOKIE_NAME)
    return res
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const user = await UserModel.findById(payload.sub).lean()
    if (!user) {
      const res = NextResponse.json({ user: null })
      res.cookies.delete(AUTH_COOKIE_NAME)
      return res
    }

    const effectiveRole = user.role === "mentor" ? "mentor" : "student"
    let mentorReviewStatus:
      | "incomplete"
      | "pending"
      | "approved"
      | "rejected"
      | undefined
    let mentorRejectReason: string | null | undefined

    if (effectiveRole === "mentor") {
      const m = await getMentorReview(user._id.toString())
      mentorReviewStatus = m.status
      mentorRejectReason = m.rejectReason
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        classYear: user.classYear ?? undefined,
        role: effectiveRole,
        ...(effectiveRole === "mentor"
          ? {
              mentorReviewStatus,
              mentorRejectReason,
            }
          : {}),
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
