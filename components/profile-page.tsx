"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ArrowLeft,
  User,
  Globe,
  LogOut,
  BookOpen,
  Target,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Sparkles,
} from "lucide-react"

const languageLabels: Record<string, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिंदी",
}

type DashboardBody = {
  overallPercent: number | null
  totalAssessments: number
  subjectBreakdown?: { subject: string; avgPercent: number; testsTaken: number }[]
  recent?: {
    subject: string
    testName: string
    score: number
    maxScore: number
    createdAt?: string
  }[]
}

export function ProfilePage() {
  const { t, user, language, logout, setCurrentPage } = useApp()
  const [dashboard, setDashboard] = useState<DashboardBody | null>(null)
  const [dashLoading, setDashLoading] = useState(true)
  const [dashErr, setDashErr] = useState<string | null>(null)

  const [careerMd, setCareerMd] = useState("")
  const [careerPct, setCareerPct] = useState<number | null>(null)
  const [careerNote, setCareerNote] = useState("")
  const [careerLoading, setCareerLoading] = useState(false)
  const [careerErr, setCareerErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setDashLoading(true)
    fetch("/api/user/dashboard", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error((body as { error?: string }).error || "Could not load")
        return body as DashboardBody
      })
      .then((data) => {
        if (!cancelled) setDashboard(data)
      })
      .catch((e: Error) => {
        if (!cancelled) setDashErr(e.message)
      })
      .finally(() => {
        if (!cancelled) setDashLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const overallProgress =
    dashboard?.overallPercent != null ? Math.round(dashboard.overallPercent) : 0
  const testsTaken = dashboard?.totalAssessments ?? 0
  const subjects = dashboard?.subjectBreakdown ?? []

  const loadCareer = async () => {
    setCareerLoading(true)
    setCareerErr(null)
    try {
      const res = await fetch("/api/ai/career-suggest", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNote: careerNote }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCareerErr((data as { error?: string }).error || "Career suggestion failed")
        return
      }
      setCareerMd((data as { careerMarkdown?: string }).careerMarkdown || "")
      const p = (data as { averagePercent?: number | null }).averagePercent
      setCareerPct(typeof p === "number" ? p : null)
    } catch {
      setCareerErr("Network error")
    } finally {
      setCareerLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button
          onClick={() => setCurrentPage("home")}
          className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
        </button>
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-bold text-foreground">{t("profile")}</h1>
      </header>

      <main className="flex-1 px-5 mt-4">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {user?.name || "Student"}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assessment average</p>
                <p className="text-base font-semibold text-foreground">
                  {dashLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin inline text-muted-foreground" />
                  ) : dashboard?.overallPercent != null ? (
                    `${overallProgress}% across saved tests`
                  ) : dashErr ? (
                    <span className="text-destructive text-sm">—</span>
                  ) : (
                    "Log scores from Course → Assessment tab"
                  )}
                </p>
              </div>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${dashboard?.overallPercent != null ? Math.min(100, overallProgress) : 0}%`,
                }}
              />
            </div>
            {dashErr && (
              <p className="mt-2 text-xs text-destructive">{dashErr}</p>
            )}
            {!dashLoading &&
              dashboard?.overallPercent == null &&
              !dashErr && (
              <p className="mt-2 text-xs text-muted-foreground">
                Complete a chapter test and save your marks to populate this bar.
              </p>
            )}
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assessments logged</p>
                <p className="text-base font-medium text-foreground">
                  {dashLoading ? "…" : `${testsTaken} saved`}
                </p>
              </div>
            </div>
            {subjects.length > 0 && (
              <ul className="text-xs space-y-1 mb-3 text-muted-foreground">
                {subjects.map((s) => (
                  <li key={s.subject} className="flex justify-between gap-2">
                    <span>{s.subject}</span>
                    <span className="font-semibold text-foreground">{s.avgPercent}%</span>
                  </li>
                ))}
              </ul>
            )}
            {dashboard?.recent && dashboard.recent.length > 0 && (
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                  Recent attempts
                </p>
                <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                  {dashboard.recent.slice(0, 5).map((r, i) => (
                    <li key={`${r.testName}-${i}`} className="text-muted-foreground">
                      <span className="text-foreground font-medium">{r.subject}</span>{" "}
                      · {r.testName}: {r.score}/{r.maxScore}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Keep taking tests to improve your ranking and scholarship eligibility.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Career path (AI)</p>
                <p className="text-base font-medium text-foreground">
                  Based on your logged assessment averages
                  {careerPct != null && (
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      (~{careerPct.toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <textarea
              className="w-full min-h-[48px] rounded-xl border border-border bg-background px-3 py-2 text-xs mb-2"
              placeholder="Optional: interests (e.g. medicine, coding, commerce)…"
              value={careerNote}
              onChange={(e) => setCareerNote(e.target.value)}
            />
            <button
              type="button"
              disabled={careerLoading}
              onClick={() => void loadCareer()}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold mb-3 inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {careerLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Generate career suggestions
            </button>
            {careerErr && (
              <p className="text-xs text-destructive mb-2">{careerErr}</p>
            )}
            {careerMd && (
              <div className="rounded-xl bg-secondary/50 p-3 text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {careerMd}
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("name")}</p>
              <p className="text-base font-medium text-foreground">
                {user?.name || "Student"}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("language")}</p>
              <p className="text-base font-medium text-foreground">
                {languageLabels[language]}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-destructive/10 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="h-11 w-11 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-base font-medium text-destructive">
              {t("logout")}
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}
