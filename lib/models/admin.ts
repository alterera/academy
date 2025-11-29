/**
 * Admin Mongoose Model
 * Stores admin credentials with username and password
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  username: string; // Unique username for admin
  password: string; // bcrypt hashed password
  name?: string; // Admin display name
  email?: string; // Admin email
  isActive: boolean; // Whether admin account is active
  lastLogin?: Date; // Last login timestamp
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
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
export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

