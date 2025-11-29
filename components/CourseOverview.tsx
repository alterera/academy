import Image from "next/image";
import React from "react";

const CourseOverview = () => {
  return (
    <div className="w-full py-20">
      <div className="max-w-6xl mx-auto flex justify-between gap-5 items-center">
        <div className="flex-1/2">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold pb-5">Overview</h2>
          <p>
            Uncover the transformative power of WhatsApp Business for connecting
            with customers, brought to you with insightful guidance from Wati.
            Check out the course overview below.
          </p>
        </div>

        <div className="flex-1/2">
            <Image src={'/v-poster.png'} height={200} width={500} alt="video" />
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
