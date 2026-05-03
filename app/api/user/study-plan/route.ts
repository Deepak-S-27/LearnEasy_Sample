import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"
import { getSessionUserId } from "@/lib/session-user"
import { StudyPlanModel } from "@/lib/models/StudyPlan"

export const runtime = "nodejs"

type WeekRow = {
  weekLabel: string
  mathematics?: string
  physics?: string
  chemistry?: string
}

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
  const doc = await StudyPlanModel.findOne({ userId: oid }).lean()
  return NextResponse.json({
    studyPlan: doc ?? null,
  })
}

export async function PATCH(req: Request) {
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
    const { weeks, goalNotes, source } = body as {
      weeks?: WeekRow[]
      goalNotes?: string
      source?: "manual" | "ai"
    }

    if (!Array.isArray(weeks)) {
      return NextResponse.json({ error: "weeks array required" }, { status: 400 })
    }

    const normalized = weeks.map((w, i) => ({
      weekLabel: w.weekLabel?.trim() || `Week ${i + 1}`,
      mathematics: String(w.mathematics ?? ""),
      physics: String(w.physics ?? ""),
      chemistry: String(w.chemistry ?? ""),
    }))

    const oid = new mongoose.Types.ObjectId(userId)
    const doc = await StudyPlanModel.findOneAndUpdate(
      { userId: oid },
      {
        userId: oid,
        weeks: normalized,
        goalNotes:
          typeof goalNotes === "string" ? goalNotes : undefined,
        source: source === "ai" || source === "manual" ? source : "manual",
      },
      { new: true, upsert: true }
    ).lean()

    return NextResponse.json({ studyPlan: doc })
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
