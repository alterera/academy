/**
 * POST /api/payment/verify
 * Verify Razorpay payment and enroll user in course
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { User, Course } from "@/lib/models";
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, "Missing payment details"),
        { status: 400 }
      );
    }

    await connectDB();

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Course not found"),
        { status: 404 }
      );
    }

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, "Invalid payment signature"),
        { status: 400 }
      );
    }

    // Verify payment with Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      if (payment.status !== "captured" && payment.status !== "authorized") {
        return NextResponse.json(
          createError(ErrorCodes.INVALID_INPUT, "Payment not successful"),
          { status: 400 }
        );
      }

      if (payment.order_id !== razorpay_order_id) {
        return NextResponse.json(
          createError(ErrorCodes.INVALID_INPUT, "Order ID mismatch"),
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Razorpay payment verification error:", error);
      return NextResponse.json(
        createError(ErrorCodes.SERVER_ERROR, "Failed to verify payment with Razorpay"),
        { status: 500 }
      );
    }

    // Get user and enroll in course
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "User not found"),
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const courseObjectId = course._id;
    if (user.enrolledCourses && user.enrolledCourses.includes(courseObjectId)) {
      return NextResponse.json({
        ok: true,
        message: "User already enrolled in this course",
        alreadyEnrolled: true,
      });
    }

    // Enroll user in course
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }
    user.enrolledCourses.push(courseObjectId);
    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Payment verified and course enrollment successful",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      courseId: courseId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to verify payment"),
      { status: 500 }
    );
  }
}

