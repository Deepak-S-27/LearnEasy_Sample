import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
import { AssessmentRecordModel } from "@/lib/models/AssessmentRecord"
import mongoose from "mongoose"
import { getSessionUserId } from "@/lib/session-user"
import { getTutorModel } from "@/lib/groq-provider"

export const runtime = "nodejs"
export const maxDuration = 60

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
    const rows = await AssessmentRecordModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean()

    const summary =
      rows.length === 0
        ? "No assessment entries yet."
        : rows
            .map(
              (r) =>
                `${r.subject} — ${r.testName}: ${r.score}/${r.maxScore}`
            )
            .join("\n")

    const pct =
      rows.length === 0
        ? null
        : rows.reduce((a, r) => a + (r.score / r.maxScore) * 100, 0) /
          rows.length

    try {
      const model = getTutorModel()
      const body = await req.json().catch(() => ({}))
      const extra = typeof body.studentNote === "string" ? body.studentNote : ""

      const { text } = await generateText({
        model,
        prompt: `Student is Tamil Nadu Class 12 (science group). Estimated average quiz performance: ${pct === null ? "unknown — encourage baseline tests first" : `${pct.toFixed(1)}%`}.

Logged assessment summaries:
${summary}

Student extra preferences: "${extra}"

Give:
### Strengths inferred
### Gaps / risk areas
### 3 plausible career/college‑prep tracks (titles + prerequisites + TN exam tie‑ins — e.g., JEE, NEET-state, CUET, vocational diplomas — keep pragmatic)
### Next-step study focus for next 30 days aligned to those gaps

Keep encouraging tone. Markdown.`,
      })

      return NextResponse.json({
        careerMarkdown: text,
        averagePercent: pct === null ? null : Number(pct.toFixed(2)),
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
