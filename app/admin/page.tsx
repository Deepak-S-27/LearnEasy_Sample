"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "learneasy_admin_secret"

type PopulatedUser = { _id: string; name: string; email: string }

export default function AdminMentorsPage() {
  const [secret, setSecret] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<
    Array<{
      _id: string
      userId: PopulatedUser | string
      qualification: string
      experience: string
      linkedin_url: string
      status: string
    }>
  >([])
  const [rejectFor, setRejectFor] = useState<string | null>(null)
  const [rejectText, setRejectText] = useState("")
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const s = sessionStorage.getItem(STORAGE_KEY)
    if (s) {
      setSecret(s)
      setSaved(true)
    }
  }, [])

  const persistSecret = () => {
    sessionStorage.setItem(STORAGE_KEY, secret.trim())
    setSaved(true)
  }

  const clearSecret = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSecret("")
    setSaved(false)
    setItems([])
  }

  const userIdStr = useCallback((row: (typeof items)[0]) => {
    const u = row.userId
    if (u && typeof u === "object" && "_id" in u) return String(u._id)
    return String(u ?? "")
  }, [])

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/mentors?status=pending", {
        headers: { "x-admin-secret": secret.trim() },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || `Error ${res.status}`)
        setItems([])
        return
      }
      setItems((data as { mentors?: typeof items }).mentors ?? [])
    } catch {
      setError("Network error")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [secret])

  useEffect(() => {
    if (saved && secret.trim()) void load()
  }, [saved, secret, load])

  const review = async (
    row: (typeof items)[0],
    action: "approve" | "reject",
    rejectReason?: string
  ) => {
    const uid = userIdStr(row)
    setActing(uid)
    setError(null)
    try {
      const res = await fetch("/api/admin/mentors/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret.trim(),
        },
        body: JSON.stringify({
          userId: uid,
          action,
          rejectReason:
            action === "reject"
              ? (rejectReason || "Rejected").trim()
              : undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || "Review failed")
        return
      }
      setRejectFor(null)
      setRejectText("")
      await load()
    } catch {
      setError("Network error")
    } finally {
      setActing(null)
    }
  }

  const downloadDoc = async (row: (typeof items)[0]) => {
    const uid = userIdStr(row)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/mentor-document?userId=${encodeURIComponent(uid)}`,
        {
          headers: { "x-admin-secret": secret.trim() },
        }
      )
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError((j as { error?: string }).error || "Download failed")
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get("Content-Disposition")
      let name = "mentor-proof"
      const m = cd?.match(/filename="([^"]+)"/)
      if (m?.[1]) name = decodeURIComponent(m[1])
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError("Download failed")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-5 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mentor review</h1>
            <p className="text-sm text-zinc-600 mt-1">
              Approve or reject pending mentor submissions. Requires{" "}
              <code className="text-xs bg-zinc-200 px-1 rounded">ADMIN_SECRET</code>{" "}
              configured on the server.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to app
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <label className="block text-xs font-semibold uppercase text-zinc-500">
            Admin secret
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="flex-1 min-w-[200px] h-10 px-3 rounded-lg border border-zinc-300 text-sm"
              placeholder="Paste ADMIN_SECRET"
            />
            <button
              type="button"
              onClick={persistSecret}
              className="h-10 px-4 rounded-lg bg-zinc-900 text-white text-sm font-semibold"
            >
              Save in session
            </button>
            <button
              type="button"
              onClick={clearSecret}
              className="h-10 px-4 rounded-lg border border-zinc-300 text-sm"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading || !secret.trim()}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              Refresh list
            </button>
          </div>
          {saved && (
            <p className="text-xs text-green-700">
              Secret stored only in this browser tab session (sessionStorage).
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-zinc-500">Loading pending mentors…</p>
        )}

        {!loading && items.length === 0 && secret.trim() && !error && (
          <p className="text-sm text-zinc-600">No pending mentor profiles.</p>
        )}

        <div className="space-y-4">
          {items.map((row) => {
            const uid = userIdStr(row)
            const u =
              typeof row.userId === "object" ? row.userId : null
            const busy = acting === uid
            return (
              <div
                key={row._id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {u?.name ?? "Mentor"}
                    </p>
                    <p className="text-xs text-zinc-500">{u?.email}</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                    onClick={() => void downloadDoc(row)}
                  >
                    Download document
                  </button>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-zinc-700">
                      Qualification:{" "}
                    </span>
                    {row.qualification || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-700">
                      Experience:{" "}
                    </span>
                    <span className="whitespace-pre-wrap">
                      {row.experience || "—"}
                    </span>
                  </p>
                  {row.linkedin_url && (
                    <p>
                      <span className="font-medium text-zinc-700">Link: </span>
                      <a
                        href={row.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline break-all"
                      >
                        {row.linkedin_url}
                      </a>
                    </p>
                  )}
                </div>

                {rejectFor === uid ? (
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <textarea
                      className="w-full rounded-lg border border-zinc-300 p-2 text-sm min-h-[72px]"
                      placeholder="Reject reason for the mentor…"
                      value={rejectText}
                      onChange={(e) => setRejectText(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50"
                        onClick={() => void review(row, "reject", rejectText)}
                      >
                        Confirm reject
                      </button>
                      <button
                        type="button"
                        className="h-9 px-4 rounded-lg border border-zinc-300 text-sm"
                        onClick={() => {
                          setRejectFor(null)
                          setRejectText("")
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
                    <button
                      type="button"
                      disabled={busy}
                      className="h-10 px-5 rounded-xl bg-green-600 text-white text-sm font-semibold disabled:opacity-50"
                      onClick={() => void review(row, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className="h-10 px-5 rounded-xl bg-red-100 text-red-800 text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
                      onClick={() => {
                        setRejectFor(uid)
                        setRejectText("")
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
