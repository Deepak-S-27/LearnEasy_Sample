"use client"

import { useApp } from "@/lib/app-context"
import { ArrowLeft, User, Globe, LogOut, BookOpen } from "lucide-react"

const languageLabels: Record<string, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिंदी",
}

export function ProfilePage() {
  const { t, user, language, setUser, setCurrentPage } = useApp()

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
