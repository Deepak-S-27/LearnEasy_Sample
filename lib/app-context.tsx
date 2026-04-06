"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type Language, translations } from "@/lib/translations"

interface User {
  name: string
  email: string
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  currentPage: string
  setCurrentPage: (page: string) => void
  initialChatMessage: string | null
  setInitialChatMessage: (msg: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [user, setUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState("landing")
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null)

  const t = (key: string) => {
    return translations[language]?.[key] ?? key
  }

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
