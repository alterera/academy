import { Clock, Lock } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto py-20">
        <div>
          <h2 className="text-xl md:text-2xl mb-5">Mock Interviews</h2>
          <div className="flex gap-5">
            <div className="flex justify-between gap-20 bg-[#cafde8] p-4 items-center rounded-xl">
              <div className="flex flex-col justify-between">
                <div className="pb-5">
                  <h2 className="font-medium text-2xl">Frontend Developer</h2>
                  <p className="text-[#1d1d1d]">React (Medium)</p>
                </div>

                <div className="flex gap-2 items-center">
                <Clock size={20} color="#1d1d1d"/>
                  <p>60 mins</p>
                </div>
              </div>

              <div className="p-2 bg-transparent border-[0.5] border-black rounded-lg group hover:bg-white">
                <Lock className="group-hover:animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
