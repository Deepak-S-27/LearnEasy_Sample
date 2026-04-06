"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { LandingPage } from "@/components/landing-page"
import { LoginPage } from "@/components/login-page"
import { SignupPage } from "@/components/signup-page"
import { DashboardPage } from "@/components/dashboard-page"
import { SubjectPage } from "@/components/subject-page"
import { ChatPage } from "@/components/chat-page"
import { ProfilePage } from "@/components/profile-page"
import { ForgotPasswordPage } from "@/components/forgot-password-page"

function AppContent() {
  const { isLoggedIn, currentPage } = useApp()

  if (!isLoggedIn) {
    if (currentPage === "login") {
      return <LoginPage />
    }
    if (currentPage === "signup") {
      return <SignupPage />
    }
    if (currentPage === "forgotPassword") {
      return <ForgotPasswordPage />
    }
    return <LandingPage />
  }

  const renderPage = () => {
    if (currentPage.startsWith("subject-")) {
      const subject = currentPage.replace("subject-", "")
      return <SubjectPage subject={subject} />
    }

    switch (currentPage) {
      case "home":
        // After login, show the same experience as the public landing page,
        // but personalized in the header with the student's name.
        return <LandingPage />
      case "chat":
        return <ChatPage />
      case "profile":
        return <ProfilePage />
      default:
        return <LandingPage />
    }
  }

  return renderPage()
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
