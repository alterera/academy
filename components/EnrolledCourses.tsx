"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  shortDescription?: string;
}

interface EnrolledCoursesProps {
  courses?: EnrolledCourse[];
}

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({ courses = [] }) => {
  if (courses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="uppercase text-xl md:text-2xl font-semibold mb-6">Courses</h2>
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            No course enrollment yet
          </p>
          <Link href="/courses">
            <Button className="bg-[#00E785] hover:bg-[#00d675] text-black font-semibold">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="uppercase text-xl md:text-2xl font-semibold mb-6">Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group w-full cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg rounded-lg"
          >
            {/* Image area */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={course.featuredImage || "/v-poster.png"}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title area */}
            <div className="p-4 bg-white text-gray-900">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{course.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
