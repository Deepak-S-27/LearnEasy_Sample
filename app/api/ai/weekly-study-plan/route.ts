import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { StudyPlanModel } from "@/lib/models/StudyPlan"
import { getTutorModel } from "@/lib/groq-provider"
import { studyPlanStructuredSchema } from "@/lib/structured-schemas"
import { generateJsonWithRetry } from "@/lib/ai-json"
import mongoose from "mongoose"

export const runtime = "nodejs"
export const maxDuration = 90

type WeekPlan = {
  weekLabel: string
  mathematics: string
  physics: string
  chemistry: string
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
    const {
      weakAreas,
      goal,
      hoursPerWeek = 15,
      weeksCount = 6,
    } = body as {
      weakAreas?: string
      goal?: string
      hoursPerWeek?: number
      weeksCount?: number
    }

    const wCount = Math.min(12, Math.max(4, Math.floor(weeksCount || 6)))
    const hrs = Math.min(40, Math.max(5, Math.floor(hoursPerWeek || 15)))

    try {
      const model = getTutorModel()

      const result = await generateJsonWithRetry({
        schema: studyPlanStructuredSchema,
        generate: async (prompt) => {
          const { text } = await generateText({
            model,
            temperature: 0.2,
            prompt,
          })
          return { text }
        },
        prompt: `Return ONLY valid JSON (no markdown) matching:
{"weeks":[{"weekLabel":"Week 1","mathematics":"- ...\\n- ...","physics":"...","chemistry":"..."}]}

Build exactly ${wCount} weekly roadmap rows for Tamil Nadu Class 12, covering Mathematics, Physics, and Chemistry together.

Goal: ${goal || "exam readiness + conceptual balance"}
Weekly study budget: ~${hrs} hours total split across three subjects.
Weak areas hint: ${weakAreas || "(not specified)"}

For each week's mathematics, physics, and chemistry fields: use short bullet lines separated by newline characters inside the string.
Include spaced revision cadence across weeks — balance workload.
weekLabel strings should be "Week 1", "Week 2", ... through "Week ${wCount}".`,
      })

      if ("error" in result) {
        return NextResponse.json(
          {
            error: result.error,
            raw: result.rawText,
          },
          { status: 422 }
        )
      }

      const rawWeeks = result.value.weeks
      if (!Array.isArray(rawWeeks) || rawWeeks.length === 0) {
        return NextResponse.json({ error: "Could not derive weeks array" }, { status: 422 })
      }

      const weeks = rawWeeks.slice(0, wCount).map((w, i) => ({
        weekLabel: w.weekLabel?.trim() || `Week ${i + 1}`,
        mathematics: String(w.mathematics || ""),
        physics: String(w.physics || ""),
        chemistry: String(w.chemistry || ""),
      })) satisfies WeekPlan[]

      const oid = new mongoose.Types.ObjectId(userId)

      const plan = await StudyPlanModel.findOneAndUpdate(
        { userId: oid },
        {
          userId: oid,
          source: "ai",
          weeks,
          goalNotes: goal ?? "",
        },
        { new: true, upsert: true }
      ).lean()

      return NextResponse.json({
        saved: true,
        plan,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
