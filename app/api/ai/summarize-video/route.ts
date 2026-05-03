import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
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
    const body = await req.json()
    const { title, url, unitName } = body as {
      title?: string
      url?: string
      unitName?: string
    }

    if (!title?.trim() || !url?.trim()) {
      return NextResponse.json(
        { error: "title and url are required" },
        { status: 400 }
      )
    }

    try {
      const model = getTutorModel()
      const { text } = await generateText({
        model,
        system: `You are a Tamil Nadu Class 12 (State Board / Samacheer-aligned) tutor. Produce concise revision notes in clear English unless the titles suggest Tamil.`,
        prompt: `Video title: ${title}\nPlaylist / unit context: ${unitName || "general"}\nURL: ${url}

You cannot watch the video. Infer likely syllabus topics ONLY from this title/context and TN 12 syllabus patterns.

Return short sections:
### Key concepts
### Formulas / laws (bullet list, use $$ for maths if needed)
### Common exam traps
### 3 quick recap questions with answers`,
      })

      return NextResponse.json({ summary: text })
    } catch (err) {
      const msg =
        err instanceof Error && err.message.includes("GROQ_API_KEY")
          ? err.message
          : err instanceof Error
            ? err.message
            : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
