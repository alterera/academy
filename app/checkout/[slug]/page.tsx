import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";
import { CheckoutWrapper } from "@/components/CheckoutWrapper";
import { CheckoutPayment } from "@/components/CheckoutPayment";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

async function getCourse(slug: string) {
  try {
    await connectDB();
    const course = await Course.findOne({
      slug: slug,
      isPublished: true,
    });

    if (!course) {
      return null;
    }

    return {
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      featuredImage: course.featuredImage || "/v-poster.png",
      price: course.price || "0",
      chapters: course.chapters,
      assessments: course.assessments,
      videos: course.videos,
      days: course.days,
    };
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

// Calculate pricing breakdown
function calculatePricing(basePrice: string) {
  // Remove ₹ and commas, convert to number
  const numericPrice = parseFloat(basePrice.replace(/[₹,]/g, "").trim()) || 0;

  const PLATFORM_FEE = 99;
  const GST_RATE = 0.18; // 18%

  const baseAmount = numericPrice;
  const platformFee = PLATFORM_FEE;
  const subtotal = baseAmount + platformFee;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return {
    baseAmount,
    platformFee,
    gst,
    total,
  };
}

// Format price with Indian numbering
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;

  // Check if user is authenticated
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/courses");
  }

  const course = await getCourse(slug);

  if (!course) {
    redirect("/courses");
  }

  const pricing = calculatePricing(course.price);
  const totalLessons = course.chapters * 2; // Approximate, can be calculated from curriculum if needed

  return (
    <CheckoutWrapper>
      <div className="w-full bg-gray-50 ">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Card */}
          <div className="bg-[#CAFDE8] rounded-2xl p-6 md:p-8 border border-[#00e785] border-r-2 md:border-r-4 border-r-[#00e785] border-b-2 md:border-b-4 border-b-[#00e785]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left/Main column */}
              <div className="md:col-span-2 space-y-4">
                {/* Header */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    Your Course & Payment Details
                  </h1>
                  <p className="mt-2 text-sm text-slate-700">
                    We are thrill to welcome you onboard. Secure payments &
                    instant access.
                  </p>
                </div>

                {/* Course card */}
                <div className="bg-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="relative w-full h-36 md:h-28 rounded-md overflow-hidden">
                      <Image
                        src={course.featuredImage}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {course.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {course.chapters} Chapters • {course.videos} Videos •{" "}
                      {course.assessments} Assessments
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                      {/* <div className="text-2xl font-bold text-slate-900">
                      ₹{formatPrice(pricing.baseAmount)}
                    </div> */}

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input
                          type="text"
                          placeholder="Coupon Code"
                          aria-label="Coupon Code"
                          className="min-w-0"
                        />
                        <Button size="sm" className="whitespace-nowrap bg-[#00e785] text-[#1d1d1d] hover:text-white">
                          Apply Coupon
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small note / terms */}
                <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                  Payment & Support Info
                </div>

                {/* Payment & Support Info */}
                <div className="hidden md:flex justify-between gap-4">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-4 w-full">
                    <CircleCheckBig className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        3 Days
                      </p>
                      <p className="text-xs text-slate-600">Refund Policy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4 w-full">
                    <CircleCheckBig className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Contact Us
                      </p>
                      <p className="text-xs text-slate-600">
                        hello@alterera.net
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4 w-full">
                    <CircleCheckBig className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Get Course
                      </p>
                      <p className="text-xs text-slate-600">
                        Completion Certificate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right/Checkout column (sticky on md+) */}
              <aside className="md:col-span-1 h-full">
                {/* <div className=""> */}
                <div className="bg-white rounded-lg p-5 shadow-sm h-full flex flex-col justify-between">
                  <div className="space-y-3 text-sm text-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Payment Summary
                    </h3>
                    <div className="flex justify-between text-xl">
                      <span>Base Amount</span>
                      <span className="font-medium">
                        ₹{formatPrice(pricing.baseAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl items-center">
                      <div className="flex flex-col">
                        <span>Platform Fee</span>
                        <span className="text-xs text-[#6e6e6e]">
                          (Server, Streaming, Bandwitch etc)
                        </span>
                      </div>
                      <span className="font-medium">
                        ₹{formatPrice(pricing.platformFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl items-center">
                      <div className="flex flex-col">
                        <span>GST @18%</span>
                        <span className="text-xs text-[#6e6e6e]">
                          (To Govt. of India)
                        </span>
                      </div>
                      <span className="font-medium">
                        ₹{formatPrice(pricing.gst)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-600">Total</p>
                        <p className="text-2xl font-bold text-slate-900">
                          ₹{formatPrice(pricing.total)}
                        </p>
                      </div>
                      {/* Payment Button */}
                      <div className="">
                        <CheckoutPayment
                          courseId={course.id}
                          courseTitle={course.title}
                          totalAmount={pricing.total}
                          razorpayKey={
                            process.env.NEXT_PUBLIC_RAZORPAY_ID ||
                            process.env.RAZORPAY_ID ||
                            ""
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Secure payment via Razorpay.
                    </div>
                  </div>
                </div>

                {/* Small support card */}
                {/* <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border">
                  <p className="text-sm font-medium text-slate-900">Need help?</p>
                  <p className="text-xs text-slate-600">Contact us at hello@alterera.net</p>
                </div> */}
                {/* </div> */}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </CheckoutWrapper>
  );
}
