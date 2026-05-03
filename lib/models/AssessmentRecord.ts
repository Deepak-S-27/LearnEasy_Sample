import mongoose, { Schema, models, model } from "mongoose"

const assessmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    testName: { type: String, required: true, trim: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true, default: 100 },
  },
  { timestamps: true }
)

export const AssessmentRecordModel =
  models.AssessmentRecord || model("AssessmentRecord", assessmentSchema)
