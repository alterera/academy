import { BookOpenCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Lesson {
  name: string;
  duration?: string;
}

interface Chapter {
  title: string;
  isPro: boolean;
  lessons: Lesson[];
}

interface CurriculumProps {
  curriculum: Chapter[];
  certificationEnabled: boolean;
}

const Curriculum: React.FC<CurriculumProps> = ({ curriculum, certificationEnabled }) => {
  if (!curriculum || curriculum.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#fdecff] py-10 px-4 md:px-0">
      <div className="max-w-3xl mx-auto space-y-6">
        {curriculum.map((chapter, chapterIndex) => (
          <div key={chapterIndex}>
            <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-0 pb-4 md:pb-5">
              <h4 className="text-lg md:text-xl font-semibold">
                {chapter.title}
              </h4>
              {chapter.isPro && (
                <p className="bg-[#00E785] nunito text-xs rounded-xs flex items-center h-fit px-2 py-1">
                  Pro
                </p>
              )}
            </div>

            {chapter.lessons && chapter.lessons.length > 0 && (
              <ul className="space-y-3 md:space-y-4">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lessonIndex}
                    className="flex items-start sm:items-center gap-2 border-b pb-2 nunito text-[#1d1d1d]"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <BookOpenCheck className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      <p className="text-sm md:text-base">{lesson.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {certificationEnabled && (
          <>
            <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-0 py-4 md:py-5">
              <h4 className="text-lg md:text-xl font-semibold">Certificate</h4>
              <p className="bg-[#00E785] nunito text-xs rounded-xs flex items-center h-fit px-2 py-1">
                Pro
              </p>
            </div>

            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-2 border-b pb-2">
                <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                  <Image
                    src={"/icons/cert-ic.svg"}
                    fill
                    alt="certificate icon"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm md:text-base">
                  Course Completion with Certificate
                </p>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Curriculum;
