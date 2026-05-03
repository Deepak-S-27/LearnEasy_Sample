import { z } from "zod"

function stripCodeFences(text: string) {
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim()
}

function tryParseJson(text: string): unknown {
  const cleaned = stripCodeFences(text)
  return JSON.parse(cleaned)
}

export async function generateJsonWithRetry<T>(
  args: {
    /** Called once to produce the model text (no json_schema response_format). */
    generate: (prompt: string) => Promise<{ text: string }>
    /** Primary prompt describing desired JSON. */
    prompt: string
    /** Zod schema to validate parsed JSON. */
    schema: z.ZodType<T>
    /** Optional second prompt suffix on retry. */
    retryHint?: string
  }
): Promise<{ value: T; rawText: string } | { error: string; rawText: string }> {
  const { generate, prompt, schema, retryHint } = args

  const attempt = async (p: string) => {
    const { text } = await generate(p)
    try {
      const parsed = tryParseJson(text)
      const validated = schema.safeParse(parsed)
      if (!validated.success) {
        return { ok: false as const, text, error: validated.error.message }
      }
      return { ok: true as const, text, value: validated.data }
    } catch (e) {
      return {
        ok: false as const,
        text,
        error: e instanceof Error ? e.message : "JSON parse error",
      }
    }
  }

  const first = await attempt(prompt)
  if (first.ok) return { value: first.value, rawText: first.text }

  const secondPrompt = `${prompt}

IMPORTANT:
- Return ONLY valid JSON (no markdown).
- Do not add trailing commas.
- Ensure all required fields exist with correct types.
${retryHint ? `- ${retryHint}` : ""}`
  const second = await attempt(secondPrompt)
  if (second.ok) return { value: second.value, rawText: second.text }

  return {
    error: `Failed to produce valid JSON. First error: ${first.error}. Second error: ${second.error}.`,
    rawText: second.text,
  }
}

