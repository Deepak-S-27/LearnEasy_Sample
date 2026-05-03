import { NextResponse } from "next/server"
import { generateText } from "ai"
import connectDB from "@/lib/mongodb"
import { getSessionUserId } from "@/lib/session-user"
import { getTutorModel } from "@/lib/groq-provider"
import {
  tnPackStructuredSchema,
  tnPackStructuredToMarkdown,
} from "@/lib/structured-schemas"
import { generateJsonWithRetry } from "@/lib/ai-json"

export const runtime = "nodejs"
export const maxDuration = 90

/** repeated | slower50 | cram24 — structured topic extraction (no verbatim QP text) */
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
    const { mode, subjectFocus } = body as {
      mode?: "repeated" | "slower50" | "cram24"
      subjectFocus?: string
    }

    if (!mode || !["repeated", "slower50", "cram24"].includes(mode)) {
      return NextResponse.json(
        { error: "mode must be repeated|slower50|cram24" },
        { status: 400 }
      )
    }

    try {
      const model = getTutorModel()

      let modePrompt = ""
      switch (mode) {
        case "repeated":
          modePrompt = `Mode: repeated (board exam QUESTION TYPE patterns).

Do NOT reproduce full past questions verbatim (copyright).

Analyse Maths, Physics, and Chemistry BOARD patterns conceptually across quarterly → half-yearly → public exams (~2020–present).

Subjects to emphasise: "${subjectFocus || "all three sciences + core maths"}"

Populate questionPatternThemes with recurring question-type themes (skills, mark bands, generic subtopics).
Populate priorityTopics with high-yield subtopics inferred from repetition.
timelineOrPhases may be omitted or briefly list "Early / Mid / Finals" checkpoints.
Keep doNotSpendMuchOn small (narrow low-yield tails).`
          break
        case "slower50":
          modePrompt = `Mode: slower50 (realistic path toward about 50 percent overall performance).

For a slower-paced learner aiming toward about half-marks level:
- Populate priorityTopics with ~35–48 compact items TOTAL (merge across Maths+Physics+Chemistry), each name + rationale + concise practiceTip (MCQs, derivation repeat, formula drills).
- Use timelineOrPhases with TWO phases labelled "Week 1" and "Week 2" (assume ~5 study hours/day). Each phase's bullets MUST list concrete topic names and daily micro-tasks splitting the mastery order.
Subjects context: "${subjectFocus || "all three"}".`
          break
        case "cram24":
          modePrompt = `Mode: cram24 — LAST ~24 hours before Tamil Nadu Class 12 exam day.

Repeated-topic cram only (generic skill names, NO copied questions).

timelineOrPhases: 6–12 phases with realistic sleep blocks (e.g. "T-24h", "Night sleep", "Exam morning").
Each phase bullets: actionable drill items (formula flashcards, 10-min MCQ sprints).
priorityTopics: top ~18–24 ultra-high-yield items with whyItRepeatsOrMatters.
doNotSpendMuchOn: ultra-short distractions to skip now.`
          break
      }

      const result = await generateJsonWithRetry({
        schema: tnPackStructuredSchema,
        generate: async (prompt) => {
          const { text } = await generateText({
            model,
            temperature: 0.2,
            system:
              "You are a TN State Board Class 12 tutor. Never copy copyrighted question papers verbatim.",
            prompt,
          })
          return { text }
        },
        prompt: `Return ONLY valid JSON (no markdown) matching:
{"title":"...","questionPatternThemes":[{"theme":"...","subjects":["Maths"],"typicalSkillOrQuestionType":"..."}],"priorityTopics":[{"name":"...","whyItRepeatsOrMatters":"...","practiceTip":"..."}],"timelineOrPhases":[{"phaseLabel":"Week 1","bullets":["..."]}],"doNotSpendMuchOn":["..."]}

${modePrompt}

Fill the fields with useful study guidance. Use empty arrays only if truly necessary.`,
        retryHint:
          "If a field is optional and not relevant, return an empty array for it.",
      })

      if ("error" in result) {
        // Final fallback: return plain text instead of failing due to structured outputs.
        // This guarantees no json_schema errors and still gives usable guidance.
        const { text } = await generateText({
          model,
          temperature: 0.2,
          system:
            "You tutor Tamil Nadu State Board Higher Secondary learners. Speak clearly with markdown headings. Do not reproduce past questions verbatim.",
          prompt: modePrompt,
        })
        return NextResponse.json({
          mode,
          content: text,
          structured: null,
          warning: result.error,
          raw: result.rawText,
        })
      }

      const content = tnPackStructuredToMarkdown(result.value, mode)

      return NextResponse.json({
        mode,
        content,
        structured: result.value,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI unavailable"
      return NextResponse.json({ error: msg }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
