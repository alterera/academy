/**
 * Iron session configuration and helpers
 * Manages secure httpOnly session cookies
 */

import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

// Session data structure
export interface SessionData {
  userId?: string;
  phone?: string;
  sessionId?: string;
  name?: string;
  isLoggedIn?: boolean;
}

// Default empty session
export const defaultSession: SessionData = {
  isLoggedIn: false,
};

// Session configuration
export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD || "fallback-password-min-32-characters-here-change-in-production",
  cookieName: "alterera-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  },
};

/**
 * Get session from cookies (Server Component / Route Handler)
 */
export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

/**
 * Save session data (mutates the session object)
 */
export async function saveSession(data: Partial<SessionData>): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  Object.assign(session, data);
  await session.save();
  
  return session;
}

/**
 * Destroy session and clear cookie
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.destroy();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && !!session.userId;
}

