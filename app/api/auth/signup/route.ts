import { NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/user-store"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body as {
      name?: string
      email?: string
      password?: string
    }

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (findUserByEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const user = createUser(name.trim(), normalizedEmail, password)
    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
