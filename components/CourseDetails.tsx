import Image from 'next/image'
import React from 'react'

const CourseDetails = () => {
  return (
    <div className='w-full py-5'>
        <div className="flex justify-between gap-4 mt-10 max-w-4xl mx-auto items-center">
          <button className="bg-[#00E785] h-fit w-80 px-8 py-2 rounded-full font-semibold">Start Now!</button>
          <div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">
              Course details
            </h2>

            <div className="grid grid-cols-2 grid-rows-2 gap-8 mt-5">
              <div className="flex items-center gap-4">
                <Image
                  src={"/icons/chapters.png"}
                  height={25}
                  width={25}
                  alt="chapters"
                />
                <p>6 Chapters</p>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={"/icons/assessments.svg"}
                  height={25}
                  width={25}
                  alt="assessments"
                />
                <p>12 Assessments</p>
              </div>
              <div className="row-start-2 flex items-center gap-4">
                <Image
                  src={"/icons/videos.svg"}
                  height={25}
                  width={25}
                  alt="videos"
                />
                <p>18 Videos</p>
              </div>
              <div className="row-start-2 flex items-center gap-4">
                <Image
                  src={"/icons/clock.svg"}
                  height={25}
                  width={25}
                  alt="course duration"
                />
                <p>30 Days</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CourseDetails