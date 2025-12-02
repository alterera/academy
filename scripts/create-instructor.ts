/**
 * Script to create the first instructor account
 * Usage: npx tsx scripts/create-instructor.ts email password "Instructor Name"
 */

import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import { Instructor } from "../lib/models/instructor";
import { hashPassword } from "../lib/auth/otp";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

async function createInstructor() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];

  if (!email || !password || !name) {
    console.error("Usage: npx tsx scripts/create-instructor.ts <email> <password> <name>");
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ email: email.toLowerCase() });
    if (existingInstructor) {
      console.error(`Error: Instructor with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create instructor
    const instructor = await Instructor.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name,
      isActive: true,
    });

    console.log(`\n✅ Instructor created successfully!`);
    console.log(`   Email: ${instructor.email}`);
    console.log(`   Name: ${instructor.name}`);
    console.log(`   ID: ${instructor._id}`);
    console.log(`\nYou can now login at /instructor/login`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating instructor:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createInstructor();

