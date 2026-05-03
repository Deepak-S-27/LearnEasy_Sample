import mongoose, { Schema, models, model } from "mongoose"

const weekRowSchema = new Schema(
  {
    weekLabel: { type: String, required: true },
    mathematics: { type: String, default: "" },
    physics: { type: String, default: "" },
    chemistry: { type: String, default: "" },
  },
  { _id: false }
)

const studyPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["manual", "ai"],
      default: "manual",
    },
    weeks: { type: [weekRowSchema], default: [] },
    goalNotes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const StudyPlanModel =
  models.StudyPlan || model("StudyPlan", studyPlanSchema)
