import mongoose, { Schema, models, model } from "mongoose"

export type MentorReviewStatus = "incomplete" | "pending" | "approved" | "rejected"

const mentorProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    qualification: { type: String, default: "" },
    experience: { type: String, default: "" },
    linkedin_url: { type: String, default: "" },
    /** Single uploaded proof (PDF/image) stored in Mongo for serverless-friendly deploys */
    proofData: { type: Buffer, default: undefined },
    proofMimeType: { type: String, default: null },
    proofOriginalName: { type: String, default: null },
    verificationCodeHash: { type: String, default: null },
    verificationExpiresAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["incomplete", "pending", "approved", "rejected"],
      default: "incomplete",
    },
    rejectReason: { type: String, default: null },
  },
  { timestamps: true }
)

export const MentorProfileModel =
  models.MentorProfile || model("MentorProfile", mentorProfileSchema)
