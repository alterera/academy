import { CircleArrowRight } from "lucide-react";
import React from "react";

const CTA = () => {
  return (
    <div className="w-full bg-[#fdecff] py-10 md:py-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 md:gap-5">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
        Become a certified professional with just a click.
        </h2>
        <p className="text-center text-sm md:text-base px-4 max-w-3xl">
        Take your skills to the next level with structured learning, hands-on projects, and expert guidance designed to accelerate your career.
        </p>
        <button className="bg-[#00E785] px-8 md:px-14 py-2.5 md:py-2 rounded-full flex gap-2 items-center hover:bg-[#00d675] transition-colors font-semibold">
          Start Now <CircleArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CTA;
