import { NextResponse } from "next/server"

/** OTP flow removed — use JWT login/register instead. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Email OTP is disabled. Please sign in with email and password, or create an account.",
    },
    { status: 410 }
  )
}
