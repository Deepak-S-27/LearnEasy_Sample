import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { hashPassword } from "@/lib/password"
import {
  AUTH_COOKIE_NAME,
  cookieBaseOptions,
  signAuthToken,
} from "@/lib/auth-token"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    await connectDB()
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Set MONGODB_URI in your environment." },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { name, email, password, classYear } = body as {
      name?: string
      email?: string
      password?: string
      classYear?: string
    }

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await UserModel.findOne({ email: normalizedEmail })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    let classYearVal: string | null = null
    if (classYear === "11" || classYear === "12") {
      classYearVal = classYear
    }

    const passwordHash = await hashPassword(password)
    const user = await UserModel.create({
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      classYear: classYearVal,
      role: "student",
    })

    let token: string
    try {
      token = signAuthToken({
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
        role: "student",
      })
    } catch {
      return NextResponse.json(
        { error: "Server misconfiguration: JWT_SECRET" },
        { status: 500 }
      )
    }

    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        classYear: user.classYear ?? undefined,
        role: "student",
      },
    })
    res.cookies.set(AUTH_COOKIE_NAME, token, cookieBaseOptions())
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}