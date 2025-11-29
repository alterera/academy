import { Clock2, LibraryBig, MessageSquare, ShieldCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const DashboardInfo = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 text-white">
      <h2>Hi, User</h2>
      <div className="flex justify-between gap-5 py-10">
        <div className="flex flex-col gap-2 items-center">
          <LibraryBig size={48} />
          <p className="text-xl">1</p>
          <h4 className="uppercase">Courses</h4>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Clock2 size={48} />
          <p className="text-xl">01:32</p>
          <h4 className="uppercase">Hours</h4>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <MessageSquare size={48} />
          <p className="text-xl">0</p>
          <h4 className="uppercase">Posts</h4>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <ShieldCheck size={48} />
          <p className="text-xl">0</p>
          <h4 className="uppercase">Certificate</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardInfo;
