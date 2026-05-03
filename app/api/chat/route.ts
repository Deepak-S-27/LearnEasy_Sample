import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"
import { NextResponse } from "next/server"
import { getTutorModel } from "@/lib/groq-provider"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  let model
  try {
    model = getTutorModel()
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Groq tutor unavailable"
    return NextResponse.json(
      {
        error: msg,
      },
      { status: 503 }
    )
  }

  try {
    const result = streamText({
      model,
      system: `You are a friendly, patient AI tutor for 11th and 12th grade students in India (Tamil Nadu State Board syllabus where relevant).
You help with Mathematics, Physics, and Chemistry doubts.
Always explain step by step in simple language.
Use examples that rural students can relate to.
If the student asks in Tamil or Hindi, respond in the same language.
Keep explanations clear and concise.
Use LaTeX notation for mathematical formulas when needed (wrap in $$ delimiters).
Be encouraging and supportive.`,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Failed to start tutor response." },
      { status: 500 }
    )
  }
}
