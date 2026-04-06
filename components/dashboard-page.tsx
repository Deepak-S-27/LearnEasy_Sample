"use client"

import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, Calculator, Atom, FlaskConical } from "lucide-react"

const subjects = [
  {
    key: "mathematics",
    descKey: "mathDesc",
    icon: Calculator,
    bgClass: "bg-[oklch(0.95_0.03_250)]",
    iconBg: "bg-[oklch(0.55_0.18_250)]",
    textClass: "text-[oklch(0.40_0.12_250)]",
  },
  {
    key: "physics",
    descKey: "physicsDesc",
    icon: Atom,
    bgClass: "bg-[oklch(0.95_0.03_155)]",
    iconBg: "bg-[oklch(0.58_0.16_155)]",
    textClass: "text-[oklch(0.38_0.10_155)]",
  },
  {
    key: "chemistry",
    descKey: "chemistryDesc",
    icon: FlaskConical,
    bgClass: "bg-[oklch(0.95_0.03_300)]",
    iconBg: "bg-[oklch(0.55_0.17_300)]",
    textClass: "text-[oklch(0.40_0.12_300)]",
  },
]

export function DashboardPage() {
  const { t, user, setCurrentPage } = useApp()

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {t("appName")}
          </span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 px-5">
        <section className="mb-6 mt-2">
          <h1 className="text-2xl font-bold text-foreground">
            {t("welcome")},
          </h1>
          <p className="text-lg text-primary font-semibold">
            {user?.name || "Student"}
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-muted-foreground mb-3">
            {t("yourSubjects")}
          </h2>
          <div className="flex flex-col gap-3">
            {subjects.map(
              ({ key, descKey, icon: Icon, bgClass, iconBg, textClass }) => (
                <button
                  key={key}
                  onClick={() => setCurrentPage(`subject-${key}`)}
                  className={`w-full ${bgClass} rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left`}
                >
                  <div
                    className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold ${textClass}`}>
                      {t(key)}
                    </h3>
                    <p className={`text-sm ${textClass} opacity-70`}>
                      {t(descKey)}
                    </p>
                  </div>
                </button>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
