/**
 * GET /api/user/payments - Get user payment history
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Payment, Course } from "@/lib/models";
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

    await connectDB();

    const payments = await Payment.find({ userId: session.userId })
      .populate({
        path: "courseId",
        select: "title slug featuredImage",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      ok: true,
      payments: payments.map((payment) => ({
        id: payment._id.toString(),
        courseId: payment.courseId._id.toString(),
        courseTitle: (payment.courseId as any).title,
        courseSlug: (payment.courseId as any).slug,
        courseImage: (payment.courseId as any).featuredImage || "/v-poster.png",
        amount: payment.amount, // Amount in paise
        currency: payment.currency,
        status: payment.status,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch payment history"),
      { status: 500 }
    );
  }
}


