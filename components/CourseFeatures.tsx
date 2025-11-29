import Image from 'next/image'
import React from 'react'

interface CourseFeature {
  icon: string;
  title: string;
}

interface CourseFeaturesProps {
  features: CourseFeature[];
}

const CourseFeatures: React.FC<CourseFeaturesProps> = ({ features }) => {
  if (!features || features.length !== 3) {
    return null;
  }

  return (
    <div className='w-full px-4 md:px-0'>
        <div className="w-full flex justify-between gap-6 md:gap-4 bg-[#fff5da] p-6 md:p-8 md:px-12 lg:px-24 rounded-2xl mt-6 md:mt-10 md:max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-2 items-center">
              <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                <Image
                  src={feature.icon}
                  fill
                  alt={feature.title}
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base text-center">{feature.title}</p>
            </div>
          ))}
        </div>
    </div>
  )
}

export default CourseFeatures