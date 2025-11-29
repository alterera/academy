/**
 * GET /api/admin/session
 * Get current admin session
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import connectDB from "@/lib/db";
import { Admin } from "@/lib/models";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    const session = await getSession();

    // Check if admin session exists
    if (!session.isAdmin || !session.adminId) {
      return NextResponse.json({
        ok: false,
        user: null,
      });
    }

    // Connect to database and verify admin still exists and is active
    await connectDB();
    const admin = await Admin.findById(session.adminId);

    if (!admin || !admin.isActive) {
      return NextResponse.json({
        ok: false,
        user: null,
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: admin._id.toString(),
        username: admin.username,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to get session"),
      { status: 500 }
    );
  }
}

