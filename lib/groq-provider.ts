import { createGroq } from "@ai-sdk/groq"

export function requireGroq() {
  const key = process.env.GROQ_API_KEY?.trim()
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is missing. Add it to .env.local and restart the dev server."
    )
  }
  return createGroq({ apiKey: key })
}

/** Fast Groq chat model — override with GROQ_MODEL */
export function getGroqChatModelId() {
  return process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile"
}

export function getTutorModel() {
  return requireGroq()(getGroqChatModelId())
}
