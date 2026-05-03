import { NextResponse } from "next/server"
import { randomInt } from "crypto"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { UserModel } from "@/lib/models/User"
import { MentorProfileModel } from "@/lib/models/MentorProfile"
import { hashPassword } from "@/lib/password"
import { sendOtpEmail } from "@/lib/email"

export const runtime = "nodejs"

/** Sends email verification code for mentor profile submission (stored hashed). */
export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const user = await UserModel.findById(userId).lean()
  if (!user || (user.role || "student") !== "mentor") {
    return NextResponse.json({ error: "Mentor account required" }, { status: 403 })
  }

  const code = String(randomInt(100000, 1000000))
  const expires = new Date(Date.now() + 15 * 60 * 1000)
  const hash = await hashPassword(code)

  await MentorProfileModel.findOneAndUpdate(
    { userId },
    {
      verificationCodeHash: hash,
      verificationExpiresAt: expires,
    },
    { upsert: true, new: true }
  )

  const sent = await sendOtpEmail(user.email, code, "mentor_verify")
  if (!sent.success) {
    return NextResponse.json(
      { error: sent.error },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true })
}
