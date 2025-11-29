import CourseDetails from "@/components/CourseDetails";
import CourseFeatures from "@/components/CourseFeatures";
import CourseOverview from "@/components/CourseOverview";
import Learning from "@/components/Learning";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-full py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center px-4">
          WhatsApp Marketing Course for Business Communication
        </h2>
        <p className="text-center text-base md:text-lg nunito text-[#1d1d1d] pt-4">
          Join 5 million businesses worldwide who use WhatsApp to connect with
          over 2 billion users. Learn how to set up your WhatsApp API Account,
          engage your customers, grow your business and more through our free
          training course.
        </p>
      </div>
      <CourseFeatures />
      <CourseDetails />
      <Learning />
      <CourseOverview />
    </div>
  );
};

export default page;
