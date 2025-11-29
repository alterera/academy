import Image from "next/image";
import React from "react";

const EnrolledCourses = () => {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="uppercase">Courses</h2>

      <div className="flex gap-4 justify-between pt-5">
        <div className="group w-full max-w-xs cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
          {/* Image area */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src="/certificate/certificate.png"
              alt="course image"
              fill
              className="object-cover"
            />
          </div>

          {/* Title area */}
          <div className="p-4 bg-white text-gray-900 font-semibold text-lg">
            Course 1
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses;
