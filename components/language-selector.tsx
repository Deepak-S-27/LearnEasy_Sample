"use client"

import { useApp } from "@/lib/app-context"
import type { Language } from "@/lib/translations"
import { Globe } from "lucide-react"

const languageLabels: Record<Language, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिंदी",
}

export function LanguageSelector() {
  const { language, setLanguage } = useApp()

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Select language"
      >
        {(Object.entries(languageLabels) as [Language, string][]).map(
          ([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          )
        )}
      </select>
    </div>
  )
}
