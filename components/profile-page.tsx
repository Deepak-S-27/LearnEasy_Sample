"use client"

import { useApp } from "@/lib/app-context"
import { ArrowLeft, User, Globe, LogOut, BookOpen, Target, CheckCircle2, ClipboardCheck } from "lucide-react"

const languageLabels: Record<string, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिंदी",
}

export function ProfilePage() {
  const { t, user, language, setUser, setCurrentPage } = useApp()
  const overallProgress = 68
  const lessonsCompleted = 34
  const totalLessons = 50
  const testsCompleted = 7
  const totalTests = 10
  const roadmap = [
    {
      step: "Math Foundation",
      detail: "Algebra, percentages, statistics, and probability",
    },
    {
      step: "Data Tools",
      detail: "Excel, SQL basics, and Power BI or Tableau",
    },
    {
      step: "Portfolio",
      detail: "Build two mini projects and one dashboard",
    },
    {
      step: "Interview Prep",
      detail: "Practice analytics questions and mock interviews",
    },
  ]

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("landing")
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
                <p className="text-xs text-muted-foreground">Overall progress</p>
                <p className="text-base font-semibold text-foreground">{overallProgress}% completed</p>
              </div>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <p className="text-muted-foreground">
                Lessons:{" "}
                <span className="font-semibold text-foreground">
                  {lessonsCompleted}/{totalLessons}
                </span>
              </p>
              <p className="text-muted-foreground text-right">
                Tests:{" "}
                <span className="font-semibold text-foreground">
                  {testsCompleted}/{totalTests}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assessments</p>
                <p className="text-base font-medium text-foreground">
                  {testsCompleted} tests completed
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep taking tests to improve your ranking and scholarship eligibility.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Roadmap guidance</p>
                <p className="text-base font-medium text-foreground">
                  Goal: Become a Data Analyst
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {roadmap.map((item, index) => (
                <div key={item.step} className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-sm font-semibold text-foreground">
                    Step {index + 1}: {item.step}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
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
