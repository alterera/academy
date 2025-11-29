/**
 * GET /api/auth/session
 * Get current session info
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: session.userId,
        phone: session.phone,
        name: session.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to get session"),
      { status: 500 }
    );
  }
}

