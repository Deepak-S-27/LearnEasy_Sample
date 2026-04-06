"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { LanguageSelector } from "@/components/language-selector"
import Image from "next/image"
import {
  BookOpen,
  ArrowRight,
  Users,
  Sparkles,
  GraduationCap,
  Calculator,
  Atom,
  FlaskConical,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react"

type LandingTab = "home" | "course" | "assessment" | "contact"

const stats = [
  { value: "#1", labelKey: "globalPlatform", highlight: true },
  { value: "12K+", labelKey: "studentsWorldwide", highlight: false },
  { value: "3K+", labelKey: "aiTutorSessions", highlight: false },
  { value: "15+", labelKey: "subjectsCovered", highlight: false },
]

const courses = [
  {
    key: "mathematics",
    descKey: "mathDesc",
    icon: Calculator,
    image: "/images/math-class.jpg",
    color: "bg-[oklch(0.55_0.18_250)]",
    lightBg: "bg-[oklch(0.95_0.03_250)]",
    textColor: "text-[oklch(0.40_0.12_250)]",
  },
  {
    key: "physics",
    descKey: "physicsDesc",
    icon: Atom,
    image: "/images/physics-lab.jpg",
    color: "bg-[oklch(0.58_0.16_155)]",
    lightBg: "bg-[oklch(0.95_0.03_155)]",
    textColor: "text-[oklch(0.38_0.10_155)]",
  },
  {
    key: "chemistry",
    descKey: "chemistryDesc",
    icon: FlaskConical,
    image: "/images/chemistry-lab.jpg",
    color: "bg-[oklch(0.55_0.17_300)]",
    lightBg: "bg-[oklch(0.95_0.03_300)]",
    textColor: "text-[oklch(0.40_0.12_300)]",
  },
]

const testimonials = [
  {
    nameKey: "testimonial1Name",
    schoolKey: "testimonial1School",
    textKey: "testimonial1Text",
    image: "/images/student-testimonial-1.jpg",
    color: "bg-[oklch(0.55_0.18_250)]",
  },
  {
    nameKey: "testimonial2Name",
    schoolKey: "testimonial2School",
    textKey: "testimonial2Text",
    image: "/images/student-testimonial-2.jpg",
    color: "bg-[oklch(0.58_0.16_155)]",
  },
]

export function LandingPage() {
  const { t, setCurrentPage, isLoggedIn, user } = useApp()
  const [activeTab, setActiveTab] = useState<LandingTab>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthenticated = isLoggedIn
  const studentName = user?.name || "Student"

  const handleLogin = () => {
    setCurrentPage("login")
  }

  const handleSignup = () => {
    setCurrentPage("signup")
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage("subjects")
    } else {
      setCurrentPage("login")
    }
  }

  const handleAiHelp = () => {
    if (isAuthenticated) {
      setCurrentPage("chat")
    } else {
      setCurrentPage("login")
    }
  }

  const navTabs: { key: LandingTab; labelKey: string }[] = [
    { key: "home", labelKey: "home" },
    { key: "course", labelKey: "course" },
    { key: "assessment", labelKey: "assessment" },
    { key: "contact", labelKey: "contact" },
  ]

  const handleNavClick = (tab: LandingTab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {t("appName")}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleNavClick(tab.key)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            {isAuthenticated ? (
              <span className="hidden sm:inline text-sm font-semibold text-foreground">
                {t("welcome")},{" "}
                <span className="text-primary">{studentName}</span>
              </span>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="hidden sm:flex h-9 px-4 rounded-xl border border-border text-foreground text-sm font-semibold items-center hover:bg-secondary active:scale-[0.98] transition-all"
                >
                  {t("login")}
                </button>
                <button
                  onClick={handleSignup}
                  className="hidden sm:flex h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold items-center hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t("signup")}
                </button>
              </>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 rounded-xl bg-secondary flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-5 py-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleNavClick(tab.key)}
                  className={`text-left text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t(tab.labelKey)}
                </button>
              ))}
            </nav>
            {!isAuthenticated && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={handleLogin}
                  className="flex-1 h-10 rounded-xl border border-border text-foreground text-sm font-semibold flex items-center justify-center hover:bg-secondary active:scale-[0.98] transition-all"
                >
                  {t("login")}
                </button>
                <button
                  onClick={handleSignup}
                  className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t("signup")}
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Tab Content */}
      {activeTab === "home" && <HomeSection t={t} onGetStarted={handleGetStarted} onAiHelp={handleAiHelp} />}
      {activeTab === "course" && <CourseSection t={t} onGetStarted={handleGetStarted} />}
      {activeTab === "assessment" && <AssessmentSection t={t} />}
      {activeTab === "contact" && <ContactSection t={t} />}

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-background">
                  {t("appName")}
                </span>
              </div>
              <p className="text-sm text-background/60 leading-relaxed">
                {t("footerDesc")}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-background mb-4">{t("quickLinks")}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <button onClick={() => setActiveTab("home")} className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("home")}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("course")} className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("course")}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("assessment")} className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("assessment")}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("contact")} className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("contact")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h3 className="font-bold text-background mb-4">{t("subjects")}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <button className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("mathematics")}
                  </button>
                </li>
                <li>
                  <button className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("physics")}
                  </button>
                </li>
                <li>
                  <button className="text-sm text-background/60 hover:text-background transition-colors">
                    {t("chemistry")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-background mb-4">{t("contactUs")}</h3>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-background/40" />
                  <span className="text-sm text-background/60">hello@learneasy.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-background/40" />
                  <span className="text-sm text-background/60">+91 9876 543 210</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-background/40" />
                  <span className="text-sm text-background/60">Chennai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/10 mt-10 pt-6 text-center">
            <p className="text-sm text-background/40">
              {"2026 "}{t("appName")}{". "}{t("allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ===== HOME SECTION ===== */
function HomeSection({ t, onGetStarted, onAiHelp }: { t: (key: string) => string; onGetStarted: () => void; onAiHelp: () => void }) {
  const { isLoggedIn, user } = useApp()
  const studentName = user?.name || "Student"

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-0 lg:pt-20 lg:pb-0">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-6">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <div className="h-7 w-7 rounded-full bg-primary/30 border-2 border-card flex items-center justify-center">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <div className="h-7 w-7 rounded-full bg-primary/40 border-2 border-card flex items-center justify-center">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">
                  {"12K+ "}{t("happyStudents")}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
                {t("heroTitle1")}{" "}
                <span className="text-primary">{t("heroTitle2")}</span>{" "}
                {t("heroTitle3")}{" "}
                <span className="text-primary">{t("appName")}!</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 text-pretty">
                {t("heroSubtitle")}
              </p>

              {isLoggedIn && (
                <div className="mb-8">
                  <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("yourProfile")}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {studentName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t("startLearning")}
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onAiHelp}
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-secondary/80 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t("aiHelp")}
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 h-16 w-16 text-primary/20">
                <Star className="h-10 w-10 fill-current" />
              </div>
              <div className="absolute top-8 -right-2 h-8 w-8 text-accent/30">
                <Sparkles className="h-6 w-6" />
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                <Image
                  src="/images/hero-students.jpg"
                  alt="Happy students learning together"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-card rounded-2xl p-3 shadow-xl border border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI-Powered</p>
                  <p className="text-sm font-bold text-foreground">Doubt Solving</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-5xl mx-auto px-5 lg:px-8 mt-12 lg:mt-16 mb-8">
          <div className="bg-foreground rounded-2xl lg:rounded-3xl p-4 lg:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center p-3 rounded-xl ${
                  stat.highlight
                    ? "bg-primary"
                    : "bg-background/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-2xl lg:text-3xl font-bold ${
                    stat.highlight ? "text-primary-foreground" : "text-background"
                  }`}>
                    {stat.value}
                  </span>
                  {stat.highlight && (
                    <div className="h-7 w-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className={`text-xs lg:text-sm mt-1 ${
                  stat.highlight ? "text-primary-foreground/80" : "text-background/70"
                }`}>
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              <span className="text-primary">{t("successStories")}</span>{" "}
              {t("ourStudents")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-pretty">
              {t("successStoriesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${testimonial.color} rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden`}
              >
                <Quote className="absolute top-4 right-4 h-10 w-10 text-white/20" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={t(testimonial.nameKey)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white">{t(testimonial.nameKey)}</p>
                    <p className="text-sm text-white/70">{t(testimonial.schoolKey)}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-white/80 text-white/80" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-white/90">
                  {t(testimonial.textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ===== COURSE SECTION ===== */
function CourseSection({ t, onGetStarted }: { t: (key: string) => string; onGetStarted: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  )

  const levelOptions: { key: "beginner" | "intermediate" | "advanced"; label: string }[] = [
    { key: "beginner", label: t("beginner") },
    { key: "intermediate", label: t("intermediate") },
    { key: "advanced", label: t("advanced") },
  ]

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            {t("popularCourses")}{" "}
            <span className="text-primary">{t("courses")}</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-pretty">
            {t("popularCoursesDesc")}
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">
            {t("selectLevel")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {levelOptions.map((level) => (
              <button
                key={level.key}
                type="button"
                onClick={() => setSelectedLevel(level.key)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                  selectedLevel === level.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-secondary"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = course.icon

            return (
              <button
                key={course.key}
                onClick={onGetStarted}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={course.image}
                    alt={t(course.key)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 ${course.color} text-white text-xs font-semibold px-3 py-1.5 rounded-lg`}>
                      {t("joinClass")}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-lg ${course.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {t(course.key)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(course.descKey)}
                  </p>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {t("selectedLevel")}
                    </p>
                    <span className="text-xs font-semibold text-primary">
                      {levelOptions.find((l) => l.key === selectedLevel)?.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ===== ASSESSMENT SECTION ===== */
function AssessmentSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ClipboardCheck className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance mb-4">
          {t("assessmentTitle")}
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-10 text-pretty">
          {t("assessmentDesc")}
        </p>

        <div className="bg-secondary/70 rounded-3xl p-8 lg:p-12 border border-border">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            {t("comingSoon")}
          </div>
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-md mx-auto text-pretty">
            {t("assessmentComingSoonDesc")}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ===== CONTACT SECTION ===== */
function ContactSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            {t("contactUs")}
          </h2>
          <p className="text-muted-foreground mt-3 text-pretty">
            {t("footerDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Email</p>
            <p className="text-sm text-muted-foreground">hello@learneasy.in</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Phone</p>
            <p className="text-sm text-muted-foreground">+91 9876 543 210</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-[oklch(0.55_0.17_300)]/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[oklch(0.55_0.17_300)]" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Location</p>
            <p className="text-sm text-muted-foreground">Chennai, India</p>
          </div>
        </div>
      </div>
    </section>
  )
}
