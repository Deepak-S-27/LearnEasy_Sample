import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/mongodb"
import { requireAdminSecret } from "@/lib/admin-auth"
import { MentorProfileModel } from "@/lib/models/MentorProfile"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const denied = requireAdminSecret(req)
  if (denied) return denied

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const body = await req.json()
    const {
      userId,
      action,
      rejectReason,
    } = body as {
      userId?: string
      action?: "approve" | "reject"
      rejectReason?: string
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid userId required" }, { status: 400 })
    }

    const mp = await MentorProfileModel.findOne({ userId })
    if (!mp) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 })
    }

    if (mp.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending profiles can be approved/rejected via this endpoint" },
        { status: 409 }
      )
    }

    if (action === "approve") {
      mp.status = "approved"
      mp.rejectReason = null
    } else if (action === "reject") {
      mp.status = "rejected"
      mp.rejectReason = (rejectReason || "Rejected").trim().slice(0, 800)
      mp.verificationCodeHash = null
      mp.verificationExpiresAt = null
    } else {
      return NextResponse.json({ error: "action must be approve|reject" }, { status: 400 })
    }

    await mp.save()
    return NextResponse.json({ ok: true, status: mp.status })
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
