import { NextResponse } from "next/server"

export function requireAdminSecret(req: Request): NextResponse | null {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) {
    return NextResponse.json(
      { error: "Admin not configured: set ADMIN_SECRET in environment" },
      { status: 503 }
    )
  }
  const h = req.headers.get("x-admin-secret")
  if (h !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}
