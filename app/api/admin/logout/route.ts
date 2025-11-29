/**
 * POST /api/admin/logout
 * Admin logout - destroys admin session
 */

import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST(request: NextRequest) {
  try {
    await destroySession();

    return NextResponse.json({
      ok: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to logout"),
      { status: 500 }
    );
  }
}

