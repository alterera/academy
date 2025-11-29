/**
 * POST /api/auth/logout
 * Destroy session and clear cookie
 */

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      ok: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to logout"),
      { status: 500 }
    );
  }
}

