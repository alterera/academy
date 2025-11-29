import Image from "next/image";
import React from "react";

interface CourseDetailsProps {
  chapters: number;
  assessments: number;
  videos: number;
  days: number;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  chapters,
  assessments,
  videos,
  days,
}) => {
  return (
    <div className="w-full py-5 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 my-6 md:mt-10 max-w-4xl mx-auto items-center">
          <button className="bg-[#00E785] hover:bg-[#00d675] transition-colors h-fit w-full md:w-80 px-6 md:px-8 py-2.5 md:py-2 rounded-full font-semibold text-sm md:text-base">
            Start Now!
          </button>
        <div className="w-full md:w-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
            Course details
          </h2>

          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-5">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/chapters.png"}
                  fill
                  alt="chapters"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{chapters} {chapters === 1 ? 'Chapter' : 'Chapters'}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/assessments.svg"}
                  fill
                  alt="assessments"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{assessments} {assessments === 1 ? 'Assessment' : 'Assessments'}</p>
            </div>
            <div className="row-start-2 flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/videos.svg"}
                  fill
                  alt="videos"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{videos} {videos === 1 ? 'Video' : 'Videos'}</p>
            </div>
            <div className="row-start-2 flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/clock.svg"}
                  fill
                  alt="course duration"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{days} {days === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
