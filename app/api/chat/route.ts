import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are a friendly, patient AI tutor for 11th and 12th grade students in India. 
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
}
