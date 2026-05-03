"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Loader2,
  X,
  ListChecks,
  BookMarked,
} from "lucide-react"
import mathPlaylistData from "@/lib/math-playlist-data.json"
import physicsPlaylistData from "@/lib/physics-playlist-data.json"
import chemistryPlaylistData from "@/lib/chemistry-playlist-data.json"

type TopicKey = "mockTest" | "pdfNotes" | "youtubeVideos"

type MathChapter = {
  chapter: number
  name: string
  exercises: { id: string; label: string; url: string }[]
}

const subjectConfig: Record<
  string,
  {
    icon: typeof Calculator
    bgClass: string
    iconBg: string
    textClass: string
    chapters: { numKey: string; nameKey: string }[]
  }
> = {
  mathematics: {
    icon: Calculator,
    bgClass: "bg-[oklch(0.95_0.03_250)]",
    iconBg: "bg-[oklch(0.55_0.18_250)]",
    textClass: "text-[oklch(0.40_0.12_250)]",
    chapters: Array.from({ length: 12 }, (_, i) => ({
      numKey: `chapter${i + 1}`,
      nameKey: `mathCh${i + 1}`,
    })),
  },
  physics: {
    icon: Atom,
    bgClass: "bg-[oklch(0.95_0.03_155)]",
    iconBg: "bg-[oklch(0.58_0.16_155)]",
    textClass: "text-[oklch(0.38_0.10_155)]",
    chapters: [
      { numKey: "chapter1", nameKey: "physicsCh1" },
      { numKey: "chapter2", nameKey: "physicsCh2" },
      { numKey: "chapter3", nameKey: "physicsCh3" },
      { numKey: "chapter4", nameKey: "physicsCh4" },
      { numKey: "chapter5", nameKey: "physicsCh5" },
    ],
  },
  chemistry: {
    icon: FlaskConical,
    bgClass: "bg-[oklch(0.95_0.03_300)]",
    iconBg: "bg-[oklch(0.55_0.17_300)]",
    textClass: "text-[oklch(0.40_0.12_300)]",
    chapters: [
      { numKey: "chapter1", nameKey: "chemCh1" },
      { numKey: "chapter2", nameKey: "chemCh2" },
      { numKey: "chapter3", nameKey: "chemCh3" },
      { numKey: "chapter4", nameKey: "chemCh4" },
      { numKey: "chapter5", nameKey: "chemCh5" },
    ],
  },
}

export function SubjectPage({ subject }: { subject: string }) {
  const { t, setCurrentPage, setInitialChatMessage } = useApp()
  const config = subjectConfig[subject]
  const [completion, setCompletion] = useState<
    Record<number, Record<TopicKey, boolean>>
  >({})
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set()
  )

  if (!config) return null

  const Icon = config.icon
  const topics: TopicKey[] = ["mockTest", "pdfNotes", "youtubeVideos"]
  const isMathematics = subject === "mathematics"
  const isPhysics = subject === "physics"
  const isChemistry = subject === "chemistry"
  const isPlaylistSubject = isMathematics || isPhysics || isChemistry
  const mathChapters = mathPlaylistData as MathChapter[]
  const physicsChapters = physicsPlaylistData as MathChapter[]
  const chemistryChapters = chemistryPlaylistData as MathChapter[]
  const activePlaylistChapters = isMathematics
    ? mathChapters
    : isPhysics
      ? physicsChapters
      : chemistryChapters
  const playlistHeading = isMathematics
    ? t("mathematics")
    : isPhysics
      ? t("physics")
      : t("chemistry")
  const subjectEnglish =
    subject === "mathematics"
      ? "Mathematics"
      : subject === "physics"
        ? "Physics"
        : subject === "chemistry"
          ? "Chemistry"
          : playlistHeading

  const [aiPanel, setAiPanel] = useState<
    null | { title: string; body: string; loading?: boolean }
  >(null)

  const openLoading = (title: string) =>
    setAiPanel({ title, body: "", loading: true })

  const summarizeVideoApi = async (
    label: string,
    url: string,
    unitName: string
  ) => {
    openLoading(`Notes · ${label}`)
    try {
      const res = await fetch("/api/ai/summarize-video", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: label, url, unitName }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAiPanel({
          title: "Error",
          body: (data as { error?: string }).error || "Request failed",
        })
        return
      }
      setAiPanel({
        title: `Notes · ${label}`,
        body: (data as { summary?: string }).summary || "",
      })
    } catch {
      setAiPanel({ title: "Error", body: "Network error" })
    }
  }

  const summarizeWholeUnit = async (ch: MathChapter) => {
    openLoading(`Unit guide · ${ch.name}`)
    try {
      const res = await fetch("/api/ai/summarize-unit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectEnglish,
          unitName: ch.name,
          videos: ch.exercises.map((ex) => ({ label: ex.label, url: ex.url })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAiPanel({
          title: "Error",
          body: (data as { error?: string }).error || "Request failed",
        })
        return
      }
      setAiPanel({
        title: `Unit guide · ${ch.name}`,
        body: (data as { summary?: string }).summary || "",
      })
    } catch {
      setAiPanel({ title: "Error", body: "Network error" })
    }
  }

  const mcqsForUnit = async (ch: MathChapter) => {
    openLoading(`MCQs · ${ch.name}`)
    try {
      const res = await fetch("/api/ai/mcqs-unit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectEnglish,
          unitName: ch.name,
          count: 8,
          videoTitlesHint: ch.exercises.map((ex) => ex.label),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAiPanel({
          title: "Error",
          body: (data as { error?: string }).error || "Request failed",
        })
        return
      }
      const pretty = JSON.stringify(
        (data as { questions?: unknown }).questions,
        null,
        2
      )
      setAiPanel({
        title: `MCQs · ${ch.name}`,
        body: pretty,
      })
    } catch {
      setAiPanel({ title: "Error", body: "Network error" })
    }
  }
  const playlistSourceUrl = isPhysics
    ? "https://www.youtube.com/watch?v=DUz5zsk4uz8&list=PL2qtWkm0Z4ccui6LY1cmczoyQYhKQFTMA"
    : isChemistry
      ? "https://www.youtube.com/watch?v=4-zRGn3lSA0&list=PL2qtWkm0Z4cf6NVtrhEtaYTkL8zSrTz8r"
      : "https://www.youtube.com/playlist?list=PL2qtWkm0Z4ceoeB0lzMfdKSKI85-l_Vv_"

  const toggleChapter = (ch: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(ch)) next.delete(ch)
      else next.add(ch)
      return next
    })
  }

  const handleSummarizeWithAI = (label: string, url: string, chapterName: string) => {
    void summarizeVideoApi(label, url, chapterName)
  }

  const askInChat = (label: string, url: string, chapterName: string) => {
    const prompt = `Please summarize and create useful revision notes for: ${label} from Chapter ${chapterName}. Video link: ${url}. Give me key concepts, formulas, and step-by-step tips to remember.`
    setInitialChatMessage(prompt)
    setCurrentPage("chat")
  }

  if (isPlaylistSubject) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-20">
        {aiPanel && (
          <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/45 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-panel-title"
          >
            <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col">
              <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
                <h2
                  id="ai-panel-title"
                  className="text-sm font-bold text-foreground pr-2"
                >
                  {aiPanel.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setAiPanel(null)}
                  className="h-9 w-9 shrink-0 rounded-xl bg-secondary flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {aiPanel.loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Generating…
                  </div>
                ) : (
                  aiPanel.body
                )}
              </div>
            </div>
          </div>
        )}
        <header className="flex items-center gap-3 px-5 pt-5 pb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-xl ${config.iconBg} flex items-center justify-center`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {playlistHeading}
            </h1>
          </div>
        </header>

        <main className="flex-1 px-5 mt-2 pb-6">
          <p className="text-sm text-muted-foreground mb-4">
            {`TN Class 12 ${playlistHeading} • Unit-wise video lessons from `}
            <a
              href={playlistSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube playlist
            </a>
          </p>
          <div className="flex flex-col gap-2">
            {activePlaylistChapters.map((ch) => {
              const isExpanded = expandedChapters.has(ch.chapter)
              return (
                <div
                  key={ch.chapter}
                  className={`w-full ${config.bgClass} rounded-2xl overflow-hidden border border-border/60`}
                >
                  <button
                    onClick={() => toggleChapter(ch.chapter)}
                    className="w-full p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                  >
                    <div
                      className={`h-10 w-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 text-white font-bold text-sm`}
                    >
                      {ch.chapter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${config.textClass} opacity-60`}>
                        {t("chapter" + ch.chapter)}
                      </p>
                      <h3 className={`text-base font-semibold ${config.textClass}`}>
                        {ch.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ch.exercises.length} videos
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className={`h-5 w-5 ${config.textClass} opacity-60 shrink-0`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${config.textClass} opacity-40 shrink-0`} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/60">
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => void summarizeWholeUnit(ch)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                        >
                          <BookMarked className="h-3.5 w-3.5" />
                          Summarize whole unit
                        </button>
                        <button
                          type="button"
                          onClick={() => void mcqsForUnit(ch)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-secondary"
                        >
                          <ListChecks className="h-3.5 w-3.5" />
                          Random MCQs (unit)
                        </button>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-3 max-h-80 overflow-y-auto">
                        {ch.exercises.map((ex) => (
                          <div
                            key={ex.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 rounded-xl bg-background/60 hover:bg-background/80 transition-colors"
                          >
                            <span className="text-sm font-medium text-foreground truncate flex-1">
                              {ex.label}
                            </span>
                            <div className="flex items-center flex-wrap gap-1.5 shrink-0">
                              <a
                                href={ex.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t("watchVideo")}
                              </a>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSummarizeWithAI(ex.label, ex.url, ch.name)
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                AI notes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  askInChat(ex.label, ex.url, ch.name)
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                              >
                                Chat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button
          onClick={() => setCurrentPage("home")}
          className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className={`h-9 w-9 rounded-xl ${config.iconBg} flex items-center justify-center`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t(subject)}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 mt-2">
        <h2 className="text-base font-semibold text-muted-foreground mb-3">
          {t("chapters")}
        </h2>
        <div className="flex flex-col gap-2">
          {config.chapters.map(({ numKey, nameKey }, index) => (
            <div
              key={index}
              className={`w-full ${config.bgClass} rounded-2xl p-4 space-y-3`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 text-white font-bold text-sm`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${config.textClass} opacity-60`}>
                    {t(numKey)}
                  </p>
                  <h3 className={`text-base font-semibold ${config.textClass}`}>
                    {t(nameKey)}
                  </h3>
                </div>
                <ChevronRight
                  className={`h-5 w-5 ${config.textClass} opacity-40 shrink-0`}
                />
              </div>

              <div className="pt-2 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {t("topicsAndResources")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topicKey) => {
                    const chapterState = completion[index] ?? {}
                    const isDone = chapterState[topicKey] ?? false

                    return (
                      <button
                        key={topicKey}
                        type="button"
                        onClick={() =>
                          setCompletion((prev) => {
                            const existing = prev[index] ?? {}
                            return {
                              ...prev,
                              [index]: {
                                ...existing,
                                [topicKey]: !isDone,
                              },
                            }
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          isDone
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-secondary"
                        }`}
                      >
                        {isDone && (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        <span>{t(topicKey)}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-2 text-[11px] text-muted-foreground">
                  {t("completionStatus")}:{" "}
                  {(() => {
                    const chapterState = completion[index] ?? {}
                    const doneCount = topics.filter(
                      (topicKey) => chapterState[topicKey]
                    ).length
                    const total = topics.length
                    return `${doneCount}/${total}`
                  })()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
