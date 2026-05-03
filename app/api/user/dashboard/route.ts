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
  const assessments = await AssessmentRecordModel.find({ userId: oid })
    .sort({ createdAt: -1 })
    .limit(120)
    .lean()

  const bySubject = new Map<
    string,
    { weightedSum: number; weightTotal: number; count: number }
  >()

  let overallSum = 0
  let overallN = 0

  for (const a of assessments) {
    const pct = (a.score / a.maxScore) * 100
    overallSum += pct
    overallN += 1
    const sub = a.subject
    const agg = bySubject.get(sub) ?? {
      weightedSum: 0,
      weightTotal: 0,
      count: 0,
    }
    agg.weightedSum += pct
    agg.weightTotal += 1
    agg.count += 1
    bySubject.set(sub, agg)
  }

  const subjectBreakdown = Array.from(bySubject.entries()).map(
    ([subject, agg]) => ({
      subject,
      avgPercent:
        agg.weightTotal > 0
          ? Number((agg.weightedSum / agg.weightTotal).toFixed(2))
          : 0,
      testsTaken: agg.count,
    })
  )

  const overallPercent =
    overallN > 0 ? Number((overallSum / overallN).toFixed(2)) : null

  return NextResponse.json({
    overallPercent,
    totalAssessments: overallN,
    subjectBreakdown,
    recent: assessments.slice(0, 8),
  })
}
