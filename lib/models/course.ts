/**
 * Course Mongoose Model
 * Stores course information and curriculum
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILesson {
  name: string;
}

export interface IChapter {
  title: string;
  isPro: boolean; // true for Pro, false for Free
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string; // URL-friendly identifier
  shortDescription: string; // Description shown on slug page
  featuredImage: string; // ImageKit URL for course featured image
  chapters: number;
  assessments: number;
  videos: number;
  days: number;
  learnings: string[]; // List of learning points
  overviewVideoUrl: string; // Video URL for overview
  curriculum: IChapter[];
  certificationEnabled: boolean; // Whether certification line is enabled
  isPublished: boolean; // Whether course is published
  // Price section
  priceTitle: string; // e.g., "Zero subscription, pay-as-you-go plan"
  price: string; // e.g., "₹1,499"
  priceDescription: string; // e.g., "For Businesses who ONLY want to send bulk campaigns"
  priceSubDescription: string; // e.g., "Cheapest plan if you send up to ~2,100 messages in 3 months."
  priceFeatures: string[]; // List of price features/benefits
  priceButtonText: string; // e.g., "Buy Now"
  priceFooterText: string; // e.g., "One time fee, no recurring subscription"
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    title: {
      type: String,
      required: true,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    lessons: {
      type: [LessonSchema],
      default: [],
    },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    chapters: {
      type: Number,
      required: true,
      min: 0,
    },
    assessments: {
      type: Number,
      required: true,
      min: 0,
    },
    videos: {
      type: Number,
      required: true,
      min: 0,
    },
    days: {
      type: Number,
      required: true,
      min: 0,
    },
    learnings: {
      type: [String],
      required: true,
      default: [],
    },
    overviewVideoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    curriculum: {
      type: [ChapterSchema],
      default: [],
    },
    certificationEnabled: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    priceTitle: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    priceDescription: {
      type: String,
      trim: true,
    },
    priceSubDescription: {
      type: String,
      trim: true,
    },
    priceFeatures: {
      type: [String],
      default: [],
    },
    priceButtonText: {
      type: String,
      trim: true,
      default: "Buy Now",
    },
    priceFooterText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

