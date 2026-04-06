"use client"

import { useApp } from "@/lib/app-context"
import { Home, BookOpen, MessageCircle, User } from "lucide-react"

const navItems = [
  { key: "home", icon: Home, labelKey: "home" },
  { key: "subjects", icon: BookOpen, labelKey: "subjects" },
  { key: "chat", icon: MessageCircle, labelKey: "aiHelp" },
  { key: "profile", icon: User, labelKey: "profile" },
]

export function BottomNav() {
  const { currentPage, setCurrentPage, t } = useApp()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {navItems.map(({ key, icon: Icon, labelKey }) => {
          const isActive = currentPage === key
          return (
            <button
              key={key}
              onClick={() => setCurrentPage(key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`}
              />
              <span className="text-[11px] font-medium leading-tight">
                {t(labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
