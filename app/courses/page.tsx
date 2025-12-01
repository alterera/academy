import { ArrowDown } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";

interface CourseData {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  price: string;
}

async function getCourses(): Promise<CourseData[]> {
  try {
    await connectDB();
    const courses = await Course.find({ isPublished: true })
      .select("title slug featuredImage price")
      .sort({ createdAt: -1 });

    return courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      featuredImage: course.featuredImage || "/v-poster.png",
      price: course.price || "0",
    }));
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

// Format price with Indian Rupee format
function formatPrice(price: string): string {
  if (!price) return "Free";
  
  // Remove any existing ₹ symbol and commas
  const numericValue = price.replace(/[₹,]/g, "").trim();
  
  // Check if it's a valid number
  const numValue = parseFloat(numericValue);
  if (isNaN(numValue) || numValue === 0) {
    return "Free";
  }
  
  // Format with Indian number system
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(numValue);
  
  return `₹${formatted}`;
}

const page = async () => {
  const courses = await getCourses();

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto py-8 md:py-20 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          We are not a course <br className="hidden md:block" />{" "}
          <span className="text-[#00E785]">Factory!</span>
        </h2>
        <p className="my-5 text-xl md:text-2xl font-medium">
          We focus on courses that really help.
        </p>

        <p className="flex items-center gap-2 text-lg pt-10 md:pt-20">
          Courses which do work <ArrowDown />
        </p>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="mt-12 text-center py-12">
            <p className="text-lg text-gray-600">
              No courses available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5 md:mt-10">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Featured Image */}
                <div className="relative w-full h-48">
                  <Image
                    src={course.featuredImage}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(course.price)}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-auto">
                    <Link href={`/courses/${course.slug}`}>
                      <Button className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
