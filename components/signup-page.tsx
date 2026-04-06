"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, Eye, EyeOff, ArrowLeft, ChevronDown, AlertCircle } from "lucide-react"

export function SignupPage() {
  const { t, setUser, setCurrentPage } = useApp()
  const [studentName, setStudentName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"form" | "otp">("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [classDropdownOpen, setClassDropdownOpen] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          purpose: "signup",
          signupData: { name: studentName.trim(), password },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to send OTP")
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
          purpose: "signup",
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

  const classOptions = [
    { value: "11", label: t("class11") },
    { value: "12", label: t("class12") },
  ]

  const handleBackToForm = () => {
    setStep("form")
    setOtp("")
    setError("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (step === "form" ? setCurrentPage("landing") : handleBackToForm)}
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

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 overflow-auto">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("signup")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === "form" ? t("appName") : t("otpSent")}
            </p>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("studentName")}
                </label>
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full h-13 px-4 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("studentName")}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="classSelect"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("selectClass")}
                </label>
                <div className="relative">
                  <button
                    id="classSelect"
                    type="button"
                    onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                    className={`w-full h-13 px-4 pr-10 rounded-2xl border border-input bg-card text-base text-left focus:outline-none focus:ring-2 focus:ring-ring flex items-center ${
                      selectedClass ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {selectedClass
                      ? classOptions.find((c) => c.value === selectedClass)?.label
                      : t("selectClass")}
                  </button>
                  <ChevronDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-transform ${
                      classDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  {classDropdownOpen && (
                    <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                      {classOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedClass(option.value)
                            setClassDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left text-base transition-colors ${
                            selectedClass === option.value
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="signupEmail"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("emailOrPhone")}
                </label>
                <input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 px-4 rounded-2xl border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("emailOrPhone")}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signupPassword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError("")
                    }}
                    className={`w-full h-13 px-4 pr-12 rounded-2xl border bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring ${
                      error ? "border-destructive" : "border-input"
                    }`}
                    placeholder={t("confirmPassword")}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
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
                <div className="flex items-center gap-2 text-destructive text-sm" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
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

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentPage("login")}
              className="text-sm text-primary font-medium"
            >
              {t("hasAccount")}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
