import React from "react";

interface LearningProps {
  learnings: string[];
}

const Learning: React.FC<LearningProps> = ({ learnings }) => {
  if (!learnings || learnings.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#fdecff] py-10 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-5">
          What you'll learn
        </h2>

        <ul className="list-disc pl-4 leading-relaxed text-base md:text-xl">
          {learnings.map((learning, index) => (
            <li key={index}>{learning}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Learning;
