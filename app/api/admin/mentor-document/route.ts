import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"
import { requireAdminSecret } from "@/lib/admin-auth"
import { MentorProfileModel } from "@/lib/models/MentorProfile"

export const runtime = "nodejs"

/** Secure download for admin only — mentor proof PDF/image. */
export async function GET(req: Request) {
  const denied = requireAdminSecret(req)
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || ""
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const mp = await MentorProfileModel.findOne({ userId })
    .select("+proofData +proofMimeType +proofOriginalName")
    .lean()

  if (!mp?.proofData || !mp?.proofMimeType) {
    return NextResponse.json({ error: "No document on file" }, { status: 404 })
  }

  const headers = new Headers()
  headers.set("Content-Type", mp.proofMimeType)
  const name = mp.proofOriginalName || "mentor-proof"
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(name)}"`
  )

  const buffer = Buffer.isBuffer(mp.proofData)
    ? mp.proofData
    : Buffer.from(mp.proofData as unknown as Uint8Array)

  return new NextResponse(new Uint8Array(buffer), { headers })
}
