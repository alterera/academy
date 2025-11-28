import Image from 'next/image'
import React from 'react'

const Certificate = () => {
  return (
    <div className='w-full py-10 md:py-20 px-4 md:px-0'>
        <div className='max-w-6xl mx-auto relative'>
            {/* Background Image Container */}
            <div className='relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden'>
                <Image 
                    src={'/certificate/bg.png'} 
                    fill
                    alt='background' 
                    className='object-cover' 
                />
                
                {/* Content Overlay */}
                <div className='absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 md:p-10'>
                    {/* Left Content */}
                    <div className='flex-1 z-10 md:pr-8'>
                        <h2 className='text-3xl md:text-4xl font-bold pb-4'>
                            Get Certified with Alterera <br className='hidden md:block' /> Academy! 
                        </h2>
                        <p className='pb-2 font-medium text-lg md:text-xl'>Highlights</p>
                        <ul className='list-disc pl-4 space-y-2 text-sm md:text-base'>
                            <li>Recognised by professionals across multiple industries.</li>
                            <li>Builds credibility for portfolios, resumes, and LinkedIn.</li>
                            <li>Reflects real-world skill mastery.</li>
                            <li>Adds competitive advantage during job applications.</li>
                        </ul>
                        <p className='pt-4 md:pt-2 font-medium text-base md:text-lg'>
                            Fast-track your growth with Alterera Certification. Dive in now!
                        </p>
                        <button className='bg-[#00E785] text-black px-8 md:px-6 rounded-full py-2 mt-4 md:mt-8 font-semibold hover:bg-[#00d675] transition-colors'>
                            Learn More
                        </button>
                    </div>
                    
                    {/* Right Certificate Image */}
                    <div className='hidden md:block relative w-[300px] h-[200px] md:w-[300px] md:h-[200px] shrink-0 z-10'>
                        <Image 
                            src={'/certificate/certificate.png'} 
                            fill
                            alt='certificate' 
                            className='object-contain' 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Certificate