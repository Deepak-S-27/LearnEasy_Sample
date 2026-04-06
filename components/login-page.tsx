"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, ArrowLeft } from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginPage() {
  const { t, setUser, setCurrentPage } = useApp()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), purpose: "login" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("invalidOtp"))
        return
      }
      setStep("otp")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          purpose: "login",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("invalidOtp"))
        return
      }
      setUser({ name: data.user.name, email: data.user.email })
      setCurrentPage("home")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setUser({ name: "Student", email: "student@gmail.com" })
    setCurrentPage("home")
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp("")
    setError("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (step === "email" ? setCurrentPage("landing") : handleBackToEmail)}
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
              {step === "email" ? t("enterEmailForOtp") : t("otpSent")}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 px-4 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("emailOrPhone")}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "..." : t("sendOtp")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("enterOtp")}
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-13 px-4 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring text-center tracking-widest"
                  placeholder="000000"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "..." : t("verifyOtp")}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">
              {t("orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Sign-in */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full h-13 rounded-2xl border border-input bg-card text-foreground font-medium text-base flex items-center justify-center gap-3 hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <GoogleIcon className="h-5 w-5" />
            {t("signInGoogle")}
          </button>

          <div className="flex flex-col items-center gap-2 mt-6">
            {step === "email" && (
              <button
                type="button"
                onClick={() => setCurrentPage("forgotPassword")}
                className="text-sm text-primary font-medium hover:underline"
              >
                {t("forgotPassword")}
              </button>
            )}
            <button
              onClick={() => setCurrentPage("signup")}
              className="text-sm text-primary font-medium"
            >
              {t("noAccount")}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
