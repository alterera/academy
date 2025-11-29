import DashboardInfo from "@/components/DashboardInfo";
import EnrolledCourses from "@/components/EnrolledCourses";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <div className="w-full bg-[#1d1d1d]">
        <DashboardInfo />
      </div>

      <div className="w-full bg-[#FFF6DA]">
        <EnrolledCourses />
      </div>
    </div>
  );
};

export default page;
