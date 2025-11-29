import Image from 'next/image'
import React from 'react'

const CourseFeatures = () => {
  return (
    <div className='w-full'>
        <div className="flex justify-between gap-4 bg-[#fff5da] p-8 px-24 rounded-2xl mt-10 max-w-4xl mx-auto">
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={"/icons/free-y.png"}
              height={60}
              width={60}
              alt="free icon"
            />
            <p>100% Free</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={"/icons/clock-1h.png"}
              height={60}
              width={60}
              alt="free icon"
            />
            <p>Complete in 1 hour</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={"/icons/certificate-y.png"}
              height={60}
              width={60}
              alt="free icon"
            />
            <p>Certificate Included</p>
          </div>
        </div>
    </div>
  )
}

export default CourseFeatures