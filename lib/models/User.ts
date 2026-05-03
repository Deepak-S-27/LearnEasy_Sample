import mongoose, { Schema, models, model } from "mongoose"

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    classYear: { type: String, default: null },
    role: {
      type: String,
      enum: ["student", "mentor"],
      default: "student",
    },
  },
  { timestamps: true }
)

export const UserModel = models.User || model("User", userSchema)
