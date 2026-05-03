"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { type Language, translations } from "@/lib/translations"

export type MentorReviewStatus =
  | "incomplete"
  | "pending"
  | "approved"
  | "rejected"

export interface AppUser {
  id?: string
  name: string
  email: string
  classYear?: string | null
  role?: "student" | "mentor"
  mentorReviewStatus?: MentorReviewStatus
  mentorRejectReason?: string | null
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  isLoggedIn: boolean
  currentPage: string
  setCurrentPage: (page: string) => void
  initialChatMessage: string | null
  setInitialChatMessage: (msg: string | null) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [user, setUser] = useState<AppUser | null>(null)
  const [currentPage, setCurrentPage] = useState("landing")
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(
    null
  )

  const t = (key: string) => {
    return translations[language]?.[key] ?? key
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } finally {
      setUser(null)
      setCurrentPage("landing")
    }
  }

  const refreshUser = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { credentials: "include" })
      const data = (await r.json()) as { user?: AppUser | null }
      if (!r.ok) return
      if (data.user) setUser(data.user)
      else if (data.user === null) setUser(null)
    } catch {
      // keep prior user on transient errors
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        setUser,
        isLoggedIn: !!user,
        currentPage,
        setCurrentPage,
        initialChatMessage,
        setInitialChatMessage,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
