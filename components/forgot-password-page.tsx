"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react"

export function ForgotPasswordPage() {
  const { t, setCurrentPage } = useApp()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"email" | "otp" | "success">("email")
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
        body: JSON.stringify({ email: email.trim(), purpose: "forgot_password" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("noAccountWithEmail"))
        return
      }
      setStep("otp")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("invalidOtp"))
        return
      }
      setStep("success")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === "email") {
      setCurrentPage("login")
    } else {
      setStep(step === "otp" ? "email" : "otp")
      setOtp("")
      setNewPassword("")
      setError("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
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
              {t("resetPassword")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === "email" && t("enterEmailForOtp")}
              {step === "otp" && t("otpSent")}
              {step === "success" && t("resetPasswordSuccess")}
            </p>
          </div>

          {step === "email" && (
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "..." : t("sendOtp")}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
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
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-13 px-4 pr-12 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t("newPassword")}
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || newPassword.length < 6}
                className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "..." : t("resetPassword")}
              </button>
            </form>
          )}

          {step === "success" && (
            <button
              onClick={() => setCurrentPage("login")}
              className="w-full h-13 rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform"
            >
              {t("login")}
            </button>
          )}

          {step !== "success" && (
            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentPage("login")}
                className="text-sm text-primary font-medium"
              >
                {t("hasAccount")}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
