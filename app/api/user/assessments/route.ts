import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"
import { getSessionUserId } from "@/lib/session-user"
import { AssessmentRecordModel } from "@/lib/models/AssessmentRecord"

export const runtime = "nodejs"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const oid = new mongoose.Types.ObjectId(userId)
  const docs = await AssessmentRecordModel.find({ userId: oid })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  return NextResponse.json({ assessments: docs })
}

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

  try {
    const body = await req.json()
    const { subject, testName, score, maxScore = 100 } = body as {
      subject?: string
      testName?: string
      score?: number
      maxScore?: number
    }

    if (!subject?.trim() || !testName?.trim()) {
      return NextResponse.json(
        { error: "subject and testName are required" },
        { status: 400 }
      )
    }

    const s = Number(score)
    const mx = Number(maxScore)
    if (Number.isNaN(s) || Number.isNaN(mx) || mx <= 0) {
      return NextResponse.json({ error: "Invalid score/maxScore" }, { status: 400 })
    }

    const clamp = Math.min(s, mx)
    const oid = new mongoose.Types.ObjectId(userId)
    const created = await AssessmentRecordModel.create({
      userId: oid,
      subject: subject.trim(),
      testName: testName.trim(),
      score: clamp,
      maxScore: mx,
    })

    return NextResponse.json({ assessment: created }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
