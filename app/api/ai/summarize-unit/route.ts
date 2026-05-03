import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { getTutorModel } from "@/lib/groq-provider"

export const runtime = "nodejs"
export const maxDuration = 120

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
    const { subject, unitName, videos } = body as {
      subject?: string
      unitName?: string
      videos?: { label: string; url: string }[]
    }

    if (!subject?.trim() || !unitName?.trim()) {
      return NextResponse.json(
        { error: "subject and unitName are required" },
        { status: 400 }
      )
    }
    if (!Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json({ error: "videos array required" }, { status: 400 })
    }

    try {
      const model = getTutorModel()
      const list = videos
        .map((v, i) => `${i + 1}. ${v.label}\n   ${v.url}`)
        .join("\n")

      const { text } = await generateText({
        model,
        system: `You compile unified revision guides for Tamil Nadu Class 12 students across Maths, Physics, and Chemistry.`,
        prompt: `Subject: ${subject}
Unit / chapter grouping: ${unitName}

Videos in this unit (titles + links only — you cannot open them):
${list}

Task: Produce ONE consolidated study guide spanning all listed videos — merge overlaps, omit repetition. Sections:
### Big picture (${unitName})
### Core ideas & definitions
### Formulas / laws / diagrams to remember ($$ latex where useful)
### Worked-pattern problems (outline steps, no long arithmetic)
### Last-minute checklist (10 bullets)

Assume Samacheer / TN Higher Secondary scope.`,
      })

      return NextResponse.json({
        summary: text,
        count: videos.length,
      })
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
