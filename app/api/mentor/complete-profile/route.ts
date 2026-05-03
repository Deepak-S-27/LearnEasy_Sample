import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { UserModel } from "@/lib/models/User"
import { MentorProfileModel } from "@/lib/models/MentorProfile"
import { verifyPassword } from "@/lib/password"

export const runtime = "nodejs"

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
])

export async function POST(req: Request) {
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

  const mp = await MentorProfileModel.findOne({ userId }).lean()
  if (!mp) {
    return NextResponse.json({ error: "Mentor profile missing" }, { status: 400 })
  }
  if (mp.status === "pending") {
    return NextResponse.json(
      { error: "Already submitted — waiting for admin review" },
      { status: 409 }
    )
  }
  if (mp.status === "approved") {
    return NextResponse.json({ error: "Profile already approved" }, { status: 409 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: "Multipart form expected" }, { status: 400 })
  }

  const qualification = String(formData.get("qualification") || "").trim()
  const experience = String(formData.get("experience") || "").trim()
  const linkedin_url = String(formData.get("linkedin_url") || "").trim()
  const verificationCode = String(formData.get("verificationCode") || "").trim()
  const file = formData.get("document")

  if (!qualification || !experience || !linkedin_url || !verificationCode) {
    return NextResponse.json(
      { error: "Qualification, experience, LinkedIn URL, and verification code are required" },
      { status: 400 }
    )
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Proof document upload is required" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 })
  }

  const mime = file.type || "application/octet-stream"
  if (!ALLOWED.has(mime)) {
    return NextResponse.json(
      { error: "Only PDF, PNG, JPEG, WEBP uploads are allowed" },
      { status: 400 }
    )
  }

  if (
    !mp.verificationCodeHash ||
    !mp.verificationExpiresAt ||
    mp.verificationExpiresAt.getTime() < Date.now()
  ) {
    return NextResponse.json(
      { error: "Verification code expired or missing — tap Send verification code again" },
      { status: 400 }
    )
  }

  const ok = await verifyPassword(verificationCode.trim(), mp.verificationCodeHash)
  if (!ok) {
    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())

  await MentorProfileModel.findOneAndUpdate(
    { userId },
    {
      qualification,
      experience,
      linkedin_url,
      proofData: buf,
      proofMimeType: mime,
      proofOriginalName: file.name.slice(0, 200),
      verificationCodeHash: null,
      verificationExpiresAt: null,
      rejectReason: null,
      status: "pending",
    }
  )

  return NextResponse.json({ ok: true, status: "pending" })
}
