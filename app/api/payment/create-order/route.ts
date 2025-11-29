/**
 * POST /api/payment/create-order
 * Create a Razorpay order for course purchase
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId, amount } = body;

    if (!courseId || !amount) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, "Course ID and amount are required"),
        { status: 400 }
      );
    }

    await connectDB();

    // Verify course exists and is published
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Course not found"),
        { status: 404 }
      );
    }

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    // Create Razorpay order (receipt must be max 40 characters)
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits of timestamp
    const courseIdShort = courseId.slice(-8); // Last 8 characters of course ID
    const receipt = `crs_${courseIdShort}_${timestamp}`; // Max 22 characters: "crs_" + 8 + "_" + 10
    
    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
      notes: {
        courseId: courseId,
        userId: session.userId,
        courseTitle: course.title,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      ok: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to create order"),
      { status: 500 }
    );
  }
}

