"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react"

const DEFAULT_ROWS = 6

type WeekRow = {
  weekLabel: string
  mathematics: string
  physics: string
  chemistry: string
}

function emptyWeeks(count: number): WeekRow[] {
  return Array.from({ length: count }, (_, i) => ({
    weekLabel: `Week ${i + 1}`,
    mathematics: "",
    physics: "",
    chemistry: "",
  }))
}

export function StudyPlanPage() {
  const { t, setCurrentPage } = useApp()
  const [weeks, setWeeks] = useState<WeekRow[]>(emptyWeeks(DEFAULT_ROWS))
  const [goalNotes, setGoalNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiGoal, setAiGoal] = useState(
    "Class 12 board exams — balance all three sciences"
  )
  const [aiWeakness, setAiWeakness] = useState("")
  const [hoursPerWeek, setHoursPerWeek] = useState(15)
  const [planWeeks, setPlanWeeks] = useState(6)
  const [generatingAi, setGeneratingAi] = useState(false)

  useEffect(() => {
    fetch("/api/user/study-plan", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { studyPlan?: { weeks?: WeekRow[]; goalNotes?: string } }) => {
        if (Array.isArray(data.studyPlan?.weeks) && data.studyPlan!.weeks!.length > 0) {
          const w = data.studyPlan!.weeks!.map((row, idx) => ({
            weekLabel: row.weekLabel || `Week ${idx + 1}`,
            mathematics: row.mathematics || "",
            physics: row.physics || "",
            chemistry: row.chemistry || "",
          }))
          setWeeks(w.length >= DEFAULT_ROWS ? w : [...w, ...emptyWeeks(DEFAULT_ROWS - w.length)])
          if (data.studyPlan?.goalNotes) setGoalNotes(data.studyPlan.goalNotes)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateRow = (
    idx: number,
    key: keyof WeekRow,
    value: string
  ) => {
    setWeeks((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: value }
      return next
    })
  }

  const handleSaveManual = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user/study-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          weeks,
          goalNotes,
          source: "manual",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert((data as { error?: string }).error || "Save failed")
        return
      }
    } catch {
      alert("Save failed")
    } finally {
      setSaving(false)
    }
  }

  const generateWithAi = async () => {
    setGeneratingAi(true)
    try {
      const res = await fetch("/api/ai/weekly-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          goal: aiGoal,
          weakAreas: aiWeakness,
          hoursPerWeek,
          weeksCount: planWeeks,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || data.raw || "AI generation failed")
        return
      }
      if (data.plan?.weeks?.length) {
        const w = data.plan.weeks.map(
          (
            row: {
              weekLabel?: string
              mathematics?: string
              physics?: string
              chemistry?: string
            },
            idx: number
          ) => ({
            weekLabel: row.weekLabel || `Week ${idx + 1}`,
            mathematics: String(row.mathematics || ""),
            physics: String(row.physics || ""),
            chemistry: String(row.chemistry || ""),
          })
        )
        setWeeks(
          w.length >= DEFAULT_ROWS
            ? w
            : [...w, ...emptyWeeks(Math.max(DEFAULT_ROWS - w.length, 0))]
        )
        setGoalNotes(aiGoal)
      }
    } catch {
      alert("AI request failed")
    } finally {
      setGeneratingAi(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-5 py-3">
        <button
          type="button"
          onClick={() => setCurrentPage("home")}
          className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
        </button>
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-primary">
            Weekly roadmap – Maths • Physics • Chemistry
          </p>
          <h1 className="text-base font-bold text-foreground truncate">
            Study plan ({t("appName")})
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-5xl mx-auto space-y-6">
        {/* AI composer */}
        <section className="rounded-2xl border border-primary/25 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary shrink-0" />
            <h2 className="text-sm font-semibold text-foreground">
              AI-generated weekly plan
            </h2>
          </div>
          <textarea
            className="w-full min-h-[64px] rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
            placeholder="Goal (exam date, boards, CUET/JEE-lite, …)"
          />
          <textarea
            className="w-full min-h-[56px] rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            value={aiWeakness}
            onChange={(e) => setAiWeakness(e.target.value)}
            placeholder="Weak areas — e.g. Integration, Optics Organic naming…"
          />
          <div className="flex flex-wrap gap-3 text-sm items-center">
            <label className="flex items-center gap-2 text-muted-foreground">
              hrs/week
              <input
                type="number"
                min={5}
                max={40}
                className="w-16 rounded-lg border border-border bg-background px-2 py-1"
                value={hoursPerWeek}
                onChange={(e) =>
                  setHoursPerWeek(Number(e.target.value) || 15)
                }
              />
            </label>
            <label className="flex items-center gap-2 text-muted-foreground">
              weeks
              <input
                type="number"
                min={4}
                max={12}
                className="w-14 rounded-lg border border-border bg-background px-2 py-1"
                value={planWeeks}
                onChange={(e) =>
                  setPlanWeeks(Number(e.target.value) || 6)
                }
              />
            </label>
            <button
              type="button"
              disabled={generatingAi}
              onClick={generateWithAi}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 font-semibold text-sm disabled:opacity-50"
            >
              {generatingAi ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Build with AI &amp; save
            </button>
          </div>
        </section>

        {/* Manual grid */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Edit topics by week (manual)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleSaveManual}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save plan"}
            </button>
          </div>
          <textarea
            className="w-full min-h-[48px] rounded-xl border border-border bg-background px-3 py-2 text-sm mb-4"
            value={goalNotes}
            onChange={(e) => setGoalNotes(e.target.value)}
            placeholder="Motivation notes / milestones / exam dates..."
          />

          <div className="space-y-4">
            {weeks.map((row, idx) => (
              <div
                key={`${row.weekLabel}-${idx}`}
                className="rounded-xl border border-border bg-background/80 p-3 space-y-2"
              >
                <label className="block text-xs font-semibold text-primary">
                  {row.weekLabel}
                  <input
                    className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-1 text-sm font-medium text-foreground"
                    value={row.weekLabel}
                    onChange={(e) =>
                      updateRow(idx, "weekLabel", e.target.value)
                    }
                  />
                </label>
                <label className="block text-[11px] font-medium text-muted-foreground">
                  Mathematics
                  <textarea
                    className="mt-1 w-full min-h-[56px] rounded-lg border border-border bg-card px-2 py-1.5 text-sm"
                    value={row.mathematics}
                    onChange={(e) =>
                      updateRow(idx, "mathematics", e.target.value)
                    }
                  />
                </label>
                <label className="block text-[11px] font-medium text-muted-foreground">
                  Physics
                  <textarea
                    className="mt-1 w-full min-h-[56px] rounded-lg border border-border bg-card px-2 py-1.5 text-sm"
                    value={row.physics}
                    onChange={(e) => updateRow(idx, "physics", e.target.value)}
                  />
                </label>
                <label className="block text-[11px] font-medium text-muted-foreground">
                  Chemistry
                  <textarea
                    className="mt-1 w-full min-h-[56px] rounded-lg border border-border bg-card px-2 py-1.5 text-sm"
                    value={row.chemistry}
                    onChange={(e) =>
                      updateRow(idx, "chemistry", e.target.value)
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground font-medium hover:bg-secondary/80"
            onClick={() =>
              setWeeks((prev) => [
                ...prev,
                {
                  weekLabel: `Week ${prev.length + 1}`,
                  mathematics: "",
                  physics: "",
                  chemistry: "",
                },
              ])
            }
          >
            + Add another week row
          </button>
        </section>
      </main>
    </div>
  )
}
