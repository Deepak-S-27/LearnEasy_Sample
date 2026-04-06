"use client"

import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
} from "lucide-react"

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

export function SubjectsListPage() {
  const { t, setCurrentPage } = useApp()

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              {t("subjects")}
            </h1>
          </div>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 px-5 mt-2">
        <div className="flex flex-col gap-3">
          {subjects.map(
            ({ key, descKey, icon: Icon, bgClass, iconBg, textClass }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(`subject-${key}`)}
                className={`w-full ${bgClass} rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left`}
              >
                <div
                  className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold ${textClass}`}>
                    {t(key)}
                  </h3>
                  <p className={`text-sm ${textClass} opacity-70 mt-0.5`}>
                    {t(descKey)}
                  </p>
                  <p className={`text-xs font-medium ${textClass} opacity-50 mt-1`}>
                    {"5 "}{t("chapters")}
                  </p>
                </div>
              </button>
            )
          )}
        </div>
      </main>
    </div>
  )
}
