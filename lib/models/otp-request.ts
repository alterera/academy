/**
 * OTP Request Mongoose Model
 * Stores OTP requests with hashed OTP for verification
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpRequest extends Document {
  _id: mongoose.Types.ObjectId;
  requestId: string; // UUID for client reference
  phone: string; // E.164 format
  otpHash: string; // bcrypt hashed OTP
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  attempts: number; // Failed verification attempts
  lastSentAt?: Date;
  channel: "whatsapp";
  // For signup flow - stores user data until verification
  signupData?: {
    name?: string;
    password?: string; // bcrypt hashed password
  };
}

const OtpRequestSchema = new Schema<IOtpRequest>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
    },
    channel: {
      type: String,
      enum: ["whatsapp"],
      default: "whatsapp",
    },
    signupData: {
      name: String,
      password: String, // Hashed password
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to auto-delete expired OTP requests after 1 hour
OtpRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const OtpRequest: Model<IOtpRequest> =
  mongoose.models.OtpRequest ||
  mongoose.model<IOtpRequest>("OtpRequest", OtpRequestSchema);

export default OtpRequest;

