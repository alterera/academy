/**
 * Script to create an admin user
 * Usage: npx tsx scripts/create-admin.ts <username> <password> [name] [email]
 * 
 * Example:
 * npx tsx scripts/create-admin.ts admin mypassword123 "Admin User" admin@example.com
 */

import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import { Admin } from "../lib/models/admin";
import { hashPassword } from "../lib/auth/otp";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set");
  console.error("Please make sure you have a .env file with MONGODB_URI defined");
  process.exit(1);
}

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/create-admin.ts <username> <password> [name] [email]");
    process.exit(1);
  }

  const [username, password, name, email] = args;

  try {
    // Connect to database
    // MONGODB_URI is guaranteed to be defined due to check above
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to database");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      console.error(`Error: Admin with username "${username}" already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      name: name || undefined,
      email: email || undefined,
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${admin.username}`);
    console.log(`   Name: ${admin.name || "N/A"}`);
    console.log(`   Email: ${admin.email || "N/A"}`);
    console.log(`   ID: ${admin._id}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

