import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { MentorProfileModel } from "@/lib/models/MentorProfile"
import { UserModel } from "@/lib/models/User"

export const runtime = "nodejs"

/** Public directory of approved mentors (for students). */
export async function GET() {
  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const profiles = await MentorProfileModel.find({ status: "approved" })
    .sort({ updatedAt: -1 })
    .limit(80)
    .lean()

  const userIds = profiles.map((p) => p.userId)
  const users = await UserModel.find({
    _id: { $in: userIds },
  })
    .select({ name: 1 })
    .lean()

  const byId = new Map(users.map((u) => [String(u._id), u]))

  const mentors = profiles.map((p) => ({
    mentorProfileId: String(p._id),
    userId: String(p.userId),
    name: byId.get(String(p.userId))?.name || "Mentor",
    qualification: p.qualification,
    experience: p.experience,
    linkedin_url: p.linkedin_url || "",
  }))

  return NextResponse.json({ mentors })
}
