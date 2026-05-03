import { z } from "zod"

/** Practice MCQs for a unit — Groq structured output */
export const mcqsUnitSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        choices: z
          .array(z.string())
          .length(4)
          .describe("Exactly four options A–D order"),
        correctIndex: z
          .number()
          .int()
          .min(0)
          .max(3)
          .describe("0-based index of correct choice"),
        explain: z.string().describe("One-line rationale"),
      })
    )
    .describe("Practice MCQs aligned to the unit"),
})

/** Weekly Maths / Physics / Chemistry roadmap */
export const studyPlanStructuredSchema = z.object({
  weeks: z.array(
    z.object({
      weekLabel: z.string(),
      mathematics: z
        .string()
        .describe("Bullet topics for the week; use \\n between bullets"),
      physics: z.string(),
      chemistry: z.string(),
    })
  ),
})

const topicThemeSchema = z.object({
  theme: z.string(),
  subjects: z.array(z.string()).optional(),
  typicalSkillOrQuestionType: z.string().optional(),
})

const priorityTopicSchema = z.object({
  name: z.string(),
  whyItRepeatsOrMatters: z.string(),
  practiceTip: z.string().optional(),
})

const phaseSchema = z.object({
  phaseLabel: z.string(),
  bullets: z.array(z.string()),
})

/** Topic extraction / board-pattern analysis (all tn-pack modes) */
export const tnPackStructuredSchema = z.object({
  title: z.string(),
  questionPatternThemes: z.array(topicThemeSchema),
  priorityTopics: z.array(priorityTopicSchema),
  timelineOrPhases: z.array(phaseSchema).optional(),
  doNotSpendMuchOn: z.array(z.string()).optional(),
})

export type McqsUnitStructured = z.infer<typeof mcqsUnitSchema>
export type StudyPlanStructured = z.infer<typeof studyPlanStructuredSchema>
export type TnPackStructured = z.infer<typeof tnPackStructuredSchema>

export function tnPackStructuredToMarkdown(
  data: TnPackStructured,
  mode: "repeated" | "slower50" | "cram24"
): string {
  const modeLabel =
    mode === "repeated"
      ? "Repeated QP patterns"
      : mode === "slower50"
        ? "~50% improvement path"
        : "Last 24h cram focus"

  let md = `# ${data.title}\n\n_${modeLabel} — Tamil Nadu Class 12 (conceptual themes, not copied questions)_\n\n`

  if (data.questionPatternThemes.length) {
    md += `## Question pattern themes\n\n`
    for (const t of data.questionPatternThemes) {
      const subs = t.subjects?.length ? ` (${t.subjects.join(", ")})` : ""
      md += `- **${t.theme}**${subs}`
      if (t.typicalSkillOrQuestionType) {
        md += ` — _${t.typicalSkillOrQuestionType}_`
      }
      md += `\n`
    }
    md += `\n`
  }

  if (data.priorityTopics.length) {
    md += `## Topic focus (prioritised)\n\n`
    for (const p of data.priorityTopics) {
      md += `- **${p.name}** — ${p.whyItRepeatsOrMatters}`
      if (p.practiceTip) md += ` _Tip: ${p.practiceTip}_`
      md += `\n`
    }
    md += `\n`
  }

  if (data.timelineOrPhases?.length) {
    md += `## Timeline / phases\n\n`
    for (const ph of data.timelineOrPhases) {
      md += `### ${ph.phaseLabel}\n`
      for (const b of ph.bullets) md += `- ${b}\n`
      md += `\n`
    }
  }

  if (data.doNotSpendMuchOn?.length) {
    md += `## Low priority right now\n\n`
    for (const x of data.doNotSpendMuchOn) md += `- ${x}\n`
  }

  return md.trimEnd()
}
