"use client"

import { useState, useEffect } from "react"
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
  Trophy,
  Handshake,
  UserCircle2,
  ExternalLink,
  CalendarPlus,
  Loader2,
  Menu,
  X,
} from "lucide-react"

type LandingTab = "home" | "course" | "assessment" | "scholarship" | "mentor" | "contact"

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

const scholarships = [
  {
    classLabel: "For Tamil Nadu State Board (Class 12 Top Scorers)",
    programs: [
      {
        name: "Tamil Nadu Government Merit Scholarship",
        amount: "Up to full fee support for eligible degree programs",
        eligibility: "Tamil Nadu State Board Class 12 pass with top merit score and income criteria",
        deadline: "July 31, 2026",
        lessonsProgress: "50/50 lessons completed",
        testsProgress: "10/10 tests completed",
        graded: "10 tests graded",
        website: "https://scholarships.gov.in/",
        featured: true,
      },
      {
        name: "First Graduate Tuition Fee Concession",
        amount: "Tuition fee concession in eligible colleges",
        eligibility: "First graduate in family + high Class 12 score in State Board",
        deadline: "August 15, 2026",
        lessonsProgress: "48/50 lessons completed",
        testsProgress: "9/10 tests completed",
        graded: "9 tests graded",
        website: "https://www.tn.gov.in/",
        featured: true,
      },
      {
        name: "State Board Topper College Support Scheme",
        amount: "Merit-based support for college admission and first-year expenses",
        eligibility: "Completed Class 12 (TN State Board) with district/state-level top score",
        deadline: "June 30, 2026",
        lessonsProgress: "50/50 lessons completed",
        testsProgress: "10/10 tests completed",
        graded: "10 tests graded",
        website: "https://www.tndge.org/",
        featured: true,
      }
    ],
  },
]

const subjectAssessments = [
  {
    subject: "Mathematics",
    chapterAssessments: [
      "Chapter 1 Test - Sets, Relations and Functions",
      "Chapter 2 Test - Complex Numbers",
      "Chapter 3 Test - Matrices and Determinants",
      "Chapter 4 Test - Vector Algebra",
      "Chapter 5 Test - Calculus",
    ],
    examPapers: {
      midterm: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      quarterly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      halfYearly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      publicExam: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    },
  },
  {
    subject: "Physics",
    chapterAssessments: [
      "Chapter 1 Test - Electrostatics",
      "Chapter 2 Test - Current Electricity",
      "Chapter 3 Test - Magnetism",
      "Chapter 4 Test - Optics",
      "Chapter 5 Test - Modern Physics",
    ],
    examPapers: {
      midterm: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      quarterly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      halfYearly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      publicExam: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    },
  },
  {
    subject: "Chemistry",
    chapterAssessments: [
      "Chapter 1 Test - Solid State",
      "Chapter 2 Test - Solutions",
      "Chapter 3 Test - Electrochemistry",
      "Chapter 4 Test - Organic Reactions",
      "Chapter 5 Test - Biomolecules",
    ],
    examPapers: {
      midterm: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      quarterly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      halfYearly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      publicExam: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    },
  },
]

export function LandingPage() {
  const { t, setCurrentPage, isLoggedIn, user, setInitialChatMessage } = useApp()
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
      // Skip intermediate subjects screen and open study content directly.
      setCurrentPage("subject-mathematics")
    } else {
      setCurrentPage("login")
    }
  }

  const handleSubjectOpen = (subjectKey: string) => {
    if (isAuthenticated) {
      setCurrentPage(`subject-${subjectKey}`)
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
    { key: "scholarship", labelKey: "scholarship" },
    { key: "mentor", labelKey: "mentor" },
    { key: "contact", labelKey: "contact" },
  ]

  const handleNavClick = (tab: LandingTab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const handleMentorConnect = (mentorName: string, mentorRole: string) => {
    const securePrompt = `Start a private and official mentor conversation with ${mentorName} (${mentorRole}). Share my study goals, ask for guidance, and keep this discussion confidential and professional.`
    setInitialChatMessage(securePrompt)
    setCurrentPage("chat")
  }

  const handleStudyPlan = () => {
    if (!isAuthenticated) {
      setCurrentPage("login")
      return
    }
    setCurrentPage("studyPlan")
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
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage("profile")}
                  className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 active:scale-[0.98] transition-all"
                  aria-label="Open profile"
                >
                  <UserCircle2 className="h-5 w-5 text-primary" />
                </button>
                <span className="text-sm font-semibold text-foreground">
                  {t("welcome")},{" "}
                  <span className="text-primary">{studentName}</span>
                </span>
              </div>
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
      {activeTab === "course" && (
        <CourseSection
          t={t}
          onOpenSubject={handleSubjectOpen}
          onOpenStudyPlan={handleStudyPlan}
        />
      )}
      {activeTab === "assessment" && (
        <AssessmentSection
          t={t}
          isLoggedIn={isAuthenticated}
          onRequireLogin={() => setCurrentPage("login")}
        />
      )}
      {activeTab === "scholarship" && <ScholarshipSection t={t} />}
      {activeTab === "mentor" && <MentorSection t={t} onConnect={handleMentorConnect} />}
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
function CourseSection({
  t,
  onOpenSubject,
  onOpenStudyPlan,
}: {
  t: (key: string) => string
  onOpenSubject: (subjectKey: string) => void
  onOpenStudyPlan: () => void
}) {
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
        <div className="flex items-start justify-start mb-6">
          <button
            type="button"
            onClick={onOpenStudyPlan}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
          >
            <CalendarPlus className="h-4 w-4 shrink-0" />
            + Study plan
          </button>
        </div>

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
                onClick={() => onOpenSubject(course.key)}
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
function AssessmentSection({
  t,
  isLoggedIn,
  onRequireLogin,
}: {
  t: (key: string) => string
  isLoggedIn: boolean
  onRequireLogin: () => void
}) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const activeSubject = subjectAssessments.find((item) => item.subject === selectedSubject)

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [mcqLoading, setMcqLoading] = useState(false)
  const [mcqError, setMcqError] = useState<string | null>(null)
  const [mcqs, setMcqs] = useState<
    { question: string; choices: string[]; correctIndex: number; explain?: string }[]
  >([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [computedScore, setComputedScore] = useState<number | null>(null)

  const [gradeOpen, setGradeOpen] = useState(false)
  const [gradeSubject, setGradeSubject] = useState("")
  const [gradeTestName, setGradeTestName] = useState("")
  const [gradeScore, setGradeScore] = useState("32")
  const [gradeMax, setGradeMax] = useState("40")
  const [gradeSubmitting, setGradeSubmitting] = useState(false)
  const [gradeError, setGradeError] = useState<string | null>(null)

  const [packLoading, setPackLoading] = useState<string | null>(null)
  const [packError, setPackError] = useState<string | null>(null)
  const [packTab, setPackTab] = useState<"repeated" | "slower50" | "cram24" | null>(null)
  const [packByMode, setPackByMode] = useState<
    Partial<Record<"repeated" | "slower50" | "cram24", string>>
  >({})

  const openGradeModal = (subject: string, testName: string) => {
    if (!isLoggedIn) {
      onRequireLogin()
      return
    }
    setGradeSubject(subject)
    setGradeTestName(testName)
    setGradeError(null)
    setGradeOpen(true)
  }

  const resetMcqState = () => {
    setMcqError(null)
    setMcqs([])
    setCurrentQ(0)
    setAnswers([])
    setSubmitted(false)
    setComputedScore(null)
  }

  const generateMcqsForUnit = async () => {
    if (!isLoggedIn) {
      onRequireLogin()
      return
    }
    if (!activeSubject?.subject || !selectedUnit) return

    setMcqLoading(true)
    setMcqError(null)
    resetMcqState()
    try {
      const res = await fetch("/api/ai/mcqs-unit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: activeSubject.subject,
          unitName: selectedUnit,
          count: 10,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMcqError((data as { error?: string }).error || "MCQ generation failed")
        return
      }
      const questions = (data as { questions?: unknown }).questions
      if (!Array.isArray(questions)) {
        setMcqError("Invalid MCQ format")
        return
      }
      const cleaned = questions
        .filter((q: any) => q && typeof q.question === "string" && Array.isArray(q.choices))
        .map((q: any) => ({
          question: String(q.question),
          choices: q.choices.map((x: any) => String(x)).slice(0, 4),
          correctIndex: Number(q.correctIndex) || 0,
          explain: typeof q.explain === "string" ? q.explain : undefined,
        }))
        .filter((q: any) => q.choices.length === 4)
      if (!cleaned.length) {
        setMcqError("No MCQs returned")
        return
      }
      setMcqs(cleaned)
      setAnswers(Array.from({ length: cleaned.length }, () => -1))
      setCurrentQ(0)
    } catch {
      setMcqError("Network error")
    } finally {
      setMcqLoading(false)
    }
  }

  const chooseAnswer = (idx: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[currentQ] = idx
      return next
    })
  }

  const submitMcqAttempt = async () => {
    if (!activeSubject?.subject || !selectedUnit) return
    const max = mcqs.length
    if (max <= 0) return
    let score = 0
    for (let i = 0; i < mcqs.length; i += 1) {
      if (answers[i] === mcqs[i]!.correctIndex) score += 1
    }
    setSubmitted(true)
    setComputedScore(score)
    openGradeModal(activeSubject.subject, `${selectedUnit} • MCQ Test`)
    setGradeScore(String(score))
    setGradeMax(String(max))
  }

  const submitGrade = async () => {
    setGradeSubmitting(true)
    setGradeError(null)
    try {
      const res = await fetch("/api/user/assessments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: gradeSubject,
          testName: gradeTestName,
          score: Number(gradeScore),
          maxScore: Number(gradeMax),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGradeError((data as { error?: string }).error || "Could not save score")
        return
      }
      setGradeOpen(false)
    } catch {
      setGradeError("Network error")
    } finally {
      setGradeSubmitting(false)
    }
  }

  const fetchPack = async (mode: "repeated" | "slower50" | "cram24") => {
    if (!isLoggedIn) {
      onRequireLogin()
      return
    }
    setPackTab(mode)
    setPackError(null)
    if (packByMode[mode]) return
    setPackLoading(mode)
    try {
      const focus = activeSubject?.subject ?? "Mathematics, Physics, Chemistry"
      const res = await fetch("/api/ai/tn-pack", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, subjectFocus: focus }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPackError((data as { error?: string }).error || "AI request failed")
        return
      }
      const content = typeof (data as { content?: string }).content === "string"
        ? (data as { content: string }).content
        : ""
      setPackByMode((prev) => ({ ...prev, [mode]: content }))
    } catch {
      setPackError("Network error")
    } finally {
      setPackLoading(null)
    }
  }

  return (
    <section className="py-16 lg:py-24 relative">
      {gradeOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="grade-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 id="grade-modal-title" className="text-lg font-bold text-foreground">
              Log assessment result
            </h3>
            <p className="text-xs text-muted-foreground">
              Scores sync to your profile dashboard so we can suggest careers and spot weak subjects.
            </p>
            <label className="block text-xs font-semibold text-muted-foreground">
              Subject
              <input
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                value={gradeSubject}
                readOnly
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Test name
              <input
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                value={gradeTestName}
                onChange={(e) => setGradeTestName(e.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Score
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Out of
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  value={gradeMax}
                  onChange={(e) => setGradeMax(e.target.value)}
                />
              </label>
            </div>
            {gradeError && (
              <p className="text-sm text-destructive">{gradeError}</p>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setGradeOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={gradeSubmitting}
                onClick={() => void submitGrade()}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2"
              >
                {gradeSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ClipboardCheck className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance mb-4">
          {t("assessmentTitle")}
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-10 text-pretty">
          {t("assessmentDesc")}
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {subjectAssessments.map((item) => (
            <button
              key={item.subject}
              type="button"
              onClick={() => setSelectedSubject(item.subject)}
              className={`text-left rounded-2xl border p-5 transition-all ${
                selectedSubject === item.subject
                  ? "bg-blue-600 border-blue-700 text-white shadow-lg"
                  : "bg-card border-border hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <p className={`text-xs font-semibold ${selectedSubject === item.subject ? "text-blue-100" : "text-primary"}`}>
                TN State Board
              </p>
              <h3 className="text-xl font-bold mt-1">{item.subject}</h3>
              <p className={`text-sm mt-2 ${selectedSubject === item.subject ? "text-blue-100" : "text-muted-foreground"}`}>
                Open chapter-wise tests and previous year question papers
              </p>
            </button>
          ))}
        </div>

        {activeSubject && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-1">
              {activeSubject.subject} - Unit wise MCQ assessments
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Select subject → select unit → generate MCQs → attempt → save marks (updates dashboard progress).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {activeSubject.chapterAssessments.map((unit, idx) => (
                <button
                  key={`${activeSubject.subject}-unit-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedUnit(unit)
                    resetMcqState()
                  }}
                  className={`text-left rounded-xl border p-3 transition-colors ${
                    selectedUnit === unit
                      ? "bg-blue-600 border-blue-700 text-white"
                      : "bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                  }`}
                >
                  <p className={`text-sm font-semibold ${selectedUnit === unit ? "text-white" : "text-blue-900"}`}>
                    {unit}
                  </p>
                  <p className={`text-xs mt-1 ${selectedUnit === unit ? "text-blue-100" : "text-blue-700"}`}>
                    Open unit
                  </p>
                </button>
              ))}
            </div>

            {selectedUnit && (
              <div className="rounded-2xl bg-white border border-blue-200 p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-blue-700">Selected unit</p>
                    <p className="text-base font-bold text-blue-950">{selectedUnit}</p>
                    {computedScore != null && (
                      <p className="text-xs text-blue-700 mt-1">
                        Last attempt: <span className="font-semibold">{computedScore}/{mcqs.length}</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={mcqLoading}
                    onClick={() => void generateMcqsForUnit()}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {mcqLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Generate MCQs
                  </button>
                </div>

                {mcqError && (
                  <p className="text-sm text-red-700 mt-3">{mcqError}</p>
                )}

                {mcqs.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between text-xs text-blue-800">
                      <span>
                        Question {currentQ + 1}/{mcqs.length}
                      </span>
                      <span>
                        Answered {answers.filter((a) => a >= 0).length}/{mcqs.length}
                      </span>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                      <p className="text-sm font-semibold text-blue-950 mb-3">
                        {mcqs[currentQ]!.question}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {mcqs[currentQ]!.choices.map((c, idx) => {
                          const selected = answers[currentQ] === idx
                          const correct = submitted && mcqs[currentQ]!.correctIndex === idx
                          const wrongSelected = submitted && selected && !correct
                          return (
                            <button
                              key={`q${currentQ}-c${idx}`}
                              type="button"
                              onClick={() => chooseAnswer(idx)}
                              className={`text-left rounded-xl border px-3 py-2 text-sm transition-colors ${
                                correct
                                  ? "bg-green-50 border-green-300"
                                  : wrongSelected
                                    ? "bg-red-50 border-red-300"
                                    : selected
                                      ? "bg-blue-600 text-white border-blue-700"
                                      : "bg-white border-blue-200 hover:bg-blue-100"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {c}
                            </button>
                          )
                        })}
                      </div>
                      {submitted && mcqs[currentQ]!.explain && (
                        <p className="text-xs text-blue-900 mt-3 whitespace-pre-wrap">
                          <span className="font-semibold">Why:</span> {mcqs[currentQ]!.explain}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={currentQ === 0}
                          onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                          className="px-3 py-2 rounded-xl border border-blue-200 text-sm font-semibold text-blue-900 bg-white disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={currentQ >= mcqs.length - 1}
                          onClick={() => setCurrentQ((p) => Math.min(mcqs.length - 1, p + 1))}
                          className="px-3 py-2 rounded-xl border border-blue-200 text-sm font-semibold text-blue-900 bg-white disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            resetMcqState()
                            void generateMcqsForUnit()
                          }}
                          className="px-3 py-2 rounded-xl border border-blue-200 text-sm font-semibold text-blue-900 bg-white"
                        >
                          Regenerate
                        </button>
                        <button
                          type="button"
                          disabled={submitted || answers.some((a) => a < 0)}
                          onClick={() => void submitMcqAttempt()}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                        >
                          Submit &amp; save marks
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-blue-300 bg-white/80 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-700" />
                <h4 className="text-base font-semibold text-blue-900">
                  AI coaching from question-paper patterns
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void fetchPack("repeated")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Repeated topics
                </button>
                <button
                  type="button"
                  onClick={() => void fetchPack("slower50")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400 text-blue-900 hover:bg-blue-100"
                >
                  Slower learner → ~50%
                </button>
                <button
                  type="button"
                  onClick={() => void fetchPack("cram24")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400 text-blue-900 hover:bg-blue-100"
                >
                  Last 24h cram
                </button>
              </div>
              {packError && (
                <p className="mt-3 text-xs text-red-700">{packError}</p>
              )}
              {packTab && (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3 max-h-72 overflow-y-auto text-xs text-blue-950 whitespace-pre-wrap leading-relaxed">
                  {packLoading === packTab ? (
                    <span className="inline-flex items-center gap-2 text-blue-800">
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      Generating…
                    </span>
                  ) : (
                    packByMode[packTab] || ""
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ===== SCHOLARSHIP SECTION ===== */
function ScholarshipSection({ t }: { t: (key: string) => string }) {
  const highestScore = 96
  const studentScore = 92
  const isEligible = studentScore >= highestScore

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 text-center">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance mb-4">
          {t("scholarshipTitle")}
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8 text-pretty">
          {t("scholarshipDesc")}
        </p>

        <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 text-left mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Highest score</p>
            <p className="text-sm font-semibold text-foreground">{highestScore}%</p>
          </div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">Your score</p>
            <p className="text-sm font-semibold text-foreground">{studentScore}%</p>
          </div>
          <button
            type="button"
            disabled={!isEligible}
            className={`w-full h-11 rounded-xl text-sm font-semibold transition-all ${
              isEligible
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isEligible ? t("applyScholarship") : t("notEligibleScholarship")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 text-left">
          {scholarships.map((bucket) => (
            bucket.programs.map((program) => (
              <div key={program.name} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">{bucket.classLabel}</p>
                      <h3 className="text-xl font-bold text-foreground leading-tight">{program.name}</h3>
                    </div>
                    {program.featured && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold text-blue-700 mb-3">{program.amount}</p>
                  <p className="text-sm text-muted-foreground mb-1">{program.eligibility}</p>
                  <p className="text-sm text-muted-foreground mb-3">Deadline: {program.deadline}</p>
                  <div className="rounded-xl bg-secondary/60 p-3 mb-4">
                    <p className="text-xs text-muted-foreground">{program.lessonsProgress}</p>
                    <p className="text-xs text-muted-foreground">{program.testsProgress}</p>
                    <p className="text-xs text-muted-foreground">{program.graded}</p>
                  </div>
                  <button
                    type="button"
                    className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply Now
                  </button>
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full h-10 rounded-lg border border-border text-sm font-semibold text-primary flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </div>
              </div>
            ))
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== MENTOR SECTION ===== */
type ApprovedMentor = {
  userId: string
  name: string
  qualification?: string
  experience?: string
  linkedin_url?: string
}

function MentorSection({ t, onConnect }: { t: (key: string) => string; onConnect: (name: string, role: string) => void }) {
  const [mentors, setMentors] = useState<ApprovedMentor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    fetch("/api/mentors/approved")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load mentors")
        return r.json()
      })
      .then((data: { mentors?: ApprovedMentor[] }) => {
        if (!cancelled) setMentors(Array.isArray(data.mentors) ? data.mentors : [])
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Could not load mentors right now.")
          setMentors([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-10">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Handshake className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance mb-4">
            {t("mentorTitle")}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty max-w-2xl mx-auto">
            {t("mentorDesc")}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-9 w-9 animate-spin text-primary" aria-label="Loading mentors" />
          </div>
        )}

        {!loading && loadError && (
          <p className="text-center text-sm text-muted-foreground py-8">{loadError}</p>
        )}

        {!loading && !loadError && mentors.length === 0 && (
          <div className="rounded-2xl border border-border bg-secondary/40 px-6 py-12 text-center max-w-xl mx-auto">
            <UserCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-semibold text-foreground mb-2">
              Verified mentors coming soon
            </p>
            <p className="text-sm text-muted-foreground">
              Approved mentors will appear here for students to connect with — check back after our team verifies applications.
            </p>
          </div>
        )}

        {!loading && mentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mentors.map((mentor) => {
              const connectContext =
                mentor.qualification?.trim() ||
                mentor.experience?.trim().slice(0, 120) ||
                "Approved mentor"
              return (
                <div key={mentor.userId} className="bg-card rounded-2xl border border-border p-5">
                  <div className="h-36 w-full rounded-xl mb-4 border border-border/60 bg-gradient-to-br from-primary/15 via-secondary to-primary/5 flex flex-col items-center justify-center px-4">
                    <UserCircle2 className="h-14 w-14 text-primary/80 mb-2" />
                    <p className="text-lg font-bold text-foreground text-center leading-tight">
                      {mentor.name}
                    </p>
                  </div>
                  {mentor.qualification?.trim() && (
                    <p className="text-sm font-semibold text-foreground">
                      {mentor.qualification.trim()}
                    </p>
                  )}
                  {mentor.experience?.trim() && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-5">
                      {mentor.experience.trim()}
                    </p>
                  )}
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Portfolio / LinkedIn
                    </a>
                  )}
                  <button
                    type="button"
                    className="mt-4 w-full h-10 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={() => onConnect(mentor.name, connectContext)}
                  >
                    {t("connectNow")}
                  </button>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Private and official mentoring messages only.
                  </p>
                </div>
              )
            })}
          </div>
        )}
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
