"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react"

export function LoginPage() {
  const { t, setUser, setCurrentPage } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }
      if (data.user) {
        const role = data.user.role === "mentor" ? "mentor" : "student"
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          classYear: data.user.classYear,
          role,
          ...(role === "mentor"
            ? {
                mentorReviewStatus:
                  data.user.mentorReviewStatus ?? ("incomplete" as const),
                mentorRejectReason: data.user.mentorRejectReason ?? null,
              }
            : {}),
        })
        setCurrentPage("home")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage("landing")}
            className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
          </button>
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {t("appName")}
          </span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("login")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("emailOrPhone")} &amp; {t("password")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t("emailOrPhone")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-13 px-4 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={t("emailOrPhone")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("password")}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              {loading ? "..." : t("login")}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setCurrentPage("forgotPassword")}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("forgotPassword")}
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage("signup")}
              className="text-sm text-primary font-medium"
            >
              {t("noAccount")}
            </button>
            <p className="text-xs text-muted-foreground pt-2 text-center leading-relaxed">
              Mentor?{" "}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => setCurrentPage("mentorSignup")}
              >
                Mentor sign up
              </button>
              {" · "}
              <span className="text-muted-foreground">
                Mentor accounts use this same login — enter your mentor email above.
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
