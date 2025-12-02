/**
 * Instructor Mongoose Model
 * Stores instructor credentials and profile information
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface IInstructor extends Document {
  _id: mongoose.Types.ObjectId;
  email: string; // Unique email for login
  password: string; // bcrypt hashed password
  name: string; // Instructor display name
  about?: string; // Instructor bio/description
  image?: string; // ImageKit URL for instructor image
  socialLinks?: ISocialLinks; // Social media links
  isActive: boolean; // Whether instructor account is active
  lastLogin?: Date; // Last login timestamp
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const InstructorSchema = new Schema<IInstructor>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development
export const Instructor: Model<IInstructor> =
  mongoose.models.Instructor || mongoose.model<IInstructor>("Instructor", InstructorSchema);

export default Instructor;

