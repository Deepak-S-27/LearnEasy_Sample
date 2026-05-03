import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { requireAdminSecret } from "@/lib/admin-auth"
import { MentorProfileModel } from "@/lib/models/MentorProfile"

export const runtime = "nodejs"

/** Admin: list mentor profiles pending review (or filter by ?status=pending|all). */
export async function GET(req: Request) {
  const denied = requireAdminSecret(req)
  if (denied) return denied

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const st = searchParams.get("status")
  const filter =
    !st || st === "pending"
      ? { status: "pending" as const }
      : st === "all"
        ? {}
        : { status: st as "pending" | "approved" | "rejected" | "incomplete" }

  const mentors = await MentorProfileModel.find(filter)
    .select("-proofData")
    .populate("userId", "name email role")
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean()

  return NextResponse.json({ mentors })
}
