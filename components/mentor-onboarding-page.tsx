"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import {
  BookOpen,
  Loader2,
  LogOut,
  Send,
  Upload,
} from "lucide-react"

export function MentorOnboardingPage() {
  const { user, refreshUser, logout } = useApp()
  const status = user?.mentorReviewStatus ?? "incomplete"
  const rejectReason = user?.mentorRejectReason

  const [qualification, setQualification] = useState("")
  const [experience, setExperience] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  const canEditForm =
    status === "incomplete" || status === "rejected"

  const sendCode = async () => {
    setErr("")
    setMsg("")
    setSending(true)
    try {
      const res = await fetch("/api/mentor/send-code", {
        method: "POST",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || "Could not send code")
        return
      }
      setMsg("Check your email for a 6-digit verification code (valid 15 minutes).")
    } catch {
      setErr("Network error")
    } finally {
      setSending(false)
    }
  }

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setMsg("")
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("qualification", qualification.trim())
      fd.append("experience", experience.trim())
      fd.append("linkedin_url", linkedinUrl.trim())
      fd.append("verificationCode", verificationCode.trim())
      if (file) fd.append("document", file)

      const res = await fetch("/api/mentor/complete-profile", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || "Submit failed")
        return
      }
      setMsg("Profile submitted — an admin will review your documents shortly.")
      await refreshUser()
    } catch {
      setErr("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Mentor verification</span>
          </div>
          <LanguageSelector />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-12 max-w-lg mx-auto text-center">
          <p className="text-5xl mb-4" aria-hidden>
            🕐
          </p>
          <h1 className="text-xl font-bold text-foreground mb-2">Under review</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your qualifications and proof have been submitted. An administrator will approve or reject
            your profile soon. Refresh below for updates.
          </p>
          <button
            type="button"
            onClick={() => void refreshUser()}
            className="mt-8 h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            Refresh status
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Mentor profile</span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 px-5 py-8 max-w-lg mx-auto w-full overflow-auto">
        <p className="text-sm text-muted-foreground mb-1">
          Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        </p>

        {status === "rejected" && rejectReason && (
          <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground">
            <p className="font-semibold text-destructive mb-1">Previous submission was not approved</p>
            <p className="text-muted-foreground">{rejectReason}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Update your details below, request a new verification code, and submit again.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h1 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
            <span aria-hidden>🎓</span> Complete Your Mentor Profile
          </h1>
          <p className="text-xs text-muted-foreground mb-6">
            After you submit, an admin will verify your certificate and approve your listing for students.
          </p>

          {canEditForm ? (
            <form onSubmit={submitProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Qualification
                </label>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground text-sm"
                  placeholder="e.g. M.Sc. Mathematics, B.Ed."
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Experience (years / description)
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm resize-y"
                  placeholder="Brief teaching or mentoring experience"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  LinkedIn / Portfolio URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground text-sm"
                  placeholder="https://"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Email verification code</p>
                <p className="text-xs text-muted-foreground">
                  We send a one-time code to your email. Enter it below with your proof upload.
                </p>
                <button
                  type="button"
                  disabled={sending || submitting}
                  onClick={() => void sendCode()}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send verification code
                </button>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Verification code
                  </label>
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground text-sm tracking-widest"
                    placeholder="6 digits"
                    maxLength={6}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Upload proof (certificate / degree)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 min-h-[100px] rounded-xl border border-dashed border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    PDF, PNG, JPEG, or WEBP (max 4 MB)
                  </span>
                  {file && (
                    <span className="text-xs font-medium text-foreground">{file.name}</span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={submitting}
                  />
                </label>
              </div>

              {err && <p className="text-sm text-destructive">{err}</p>}
              {msg && <p className="text-sm text-green-700 dark:text-green-400">{msg}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit for verification
              </button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="mt-8 w-full h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary inline-flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </main>
    </div>
  )
}
