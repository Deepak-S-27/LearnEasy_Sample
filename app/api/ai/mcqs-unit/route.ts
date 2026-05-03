import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { getTutorModel } from "@/lib/groq-provider"
import { mcqsUnitSchema } from "@/lib/structured-schemas"
import { generateJsonWithRetry } from "@/lib/ai-json"

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
    const body = await req.json()
    const {
      subject,
      unitName,
      count = 8,
      videoTitlesHint,
    } = body as {
      subject?: string
      unitName?: string
      count?: number
      videoTitlesHint?: string[]
    }

    if (!subject?.trim() || !unitName?.trim()) {
      return NextResponse.json(
        { error: "subject and unitName are required" },
        { status: 400 }
      )
    }

    const n = Math.min(25, Math.max(3, Math.floor(Number(count) || 8)))

    try {
      const model = getTutorModel()
      const hint =
        Array.isArray(videoTitlesHint) && videoTitlesHint.length
          ? `Video titles in this unit: ${videoTitlesHint.slice(0, 30).join(" | ")}`
          : ""

      const schema = mcqsUnitSchema

      const result = await generateJsonWithRetry({
        schema,
        generate: async (prompt) => {
          const { text } = await generateText({
            model,
            temperature: 0.25,
            prompt,
          })
          return { text }
        },
        prompt: `Return ONLY strict JSON (no markdown, no extra text) matching this shape:
{"questions":[{"question":"...","choices":["A","B","C","D"],"correctIndex":1,"explain":"..."}]}

You create practice assessment items for Tamil Nadu Class 12 State Board.

Subject: ${subject}
Unit / context: "${unitName}"
Generate exactly ${n} distinct questions (${n} items in the questions array).

${hint}

Rules:
- Each item: exactly 4 plausible choices as strings in order A–D, one correct answer via correctIndex 0–3.
- Prefer exam-style stem wording; vary difficulty slightly.
- explain: one concise line justifying the key idea.`,
      })

      if ("error" in result) {
        return NextResponse.json(
          { error: result.error, raw: result.rawText },
          { status: 422 }
        )
      }

      return NextResponse.json({ questions: result.value.questions.slice(0, n) })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
