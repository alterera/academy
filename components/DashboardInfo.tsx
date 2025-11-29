"use client";

import { Clock2, LibraryBig, MessageSquare, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DashboardInfoProps {
  userName?: string;
  courseCount?: number;
  certificateCount?: number;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  userName = "User",
  courseCount = 0,
  certificateCount = 0,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 text-white">
      <h2 className="text-xl md:text-2xl font-semibold">Hi, {userName}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 py-6 md:py-10">
        <div className="flex flex-col gap-2 items-center">
          <LibraryBig size={40} className="md:w-12 md:h-12" />
          <p className="text-lg md:text-xl font-semibold">{courseCount}</p>
          <h4 className="uppercase text-sm md:text-base">Courses</h4>
        </div>
        <div className="flex flex-col gap-2 items-center opacity-50 grayscale">
          <Clock2 size={40} className="md:w-12 md:h-12" />
          <p className="text-lg md:text-xl font-semibold">--</p>
          <h4 className="uppercase text-sm md:text-base">Hours</h4>
        </div>
        <div className="flex flex-col gap-2 items-center opacity-50 grayscale">
          <MessageSquare size={40} className="md:w-12 md:h-12" />
          <p className="text-lg md:text-xl font-semibold">--</p>
          <h4 className="uppercase text-sm md:text-base">Posts</h4>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <ShieldCheck size={40} className="md:w-12 md:h-12" />
          <p className="text-lg md:text-xl font-semibold">{certificateCount}</p>
          <h4 className="uppercase text-sm md:text-base">Certificate</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardInfo;
