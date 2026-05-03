import mongoose from "mongoose"
import { MentorProfileModel } from "@/lib/models/MentorProfile"

export async function getMentorReview(
  userId: string | mongoose.Types.ObjectId
) {
  const uid = typeof userId === "string" ? userId : userId.toString()
  let mp = await MentorProfileModel.findOne({ userId: uid }).lean()
  if (!mp) {
    await MentorProfileModel.create({ userId: uid, status: "incomplete" })
    mp = await MentorProfileModel.findOne({ userId: uid }).lean()
  }
  return {
    status: mp!.status as "incomplete" | "pending" | "approved" | "rejected",
    rejectReason: mp!.rejectReason ?? null,
  }
}
