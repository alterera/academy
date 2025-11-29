/**
 * User Mongoose Model
 * Stores user information with phone as unique identifier
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  phone: string; // E.164 format, unique
  name?: string;
  email?: string;
  createdAt: Date;
  lastLogin?: Date;
  // Course enrollment mapping
  enrolledCourses?: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    lastLogin: {
      type: Date,
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

