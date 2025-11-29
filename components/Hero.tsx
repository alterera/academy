import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className='w-full py-10 md:py-20 px-4 md:px-0'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0'>
            <div className='flex-1 leading-relaxed flex flex-col gap-4 text-center md:text-left'>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
                    Welcome to Alterera <br className='hidden md:block'/> Academy!
                </h2>
                <p className='text-base md:text-lg'>Upgrade your skills with industry-ready courses crafted for real-world success.</p>
                <Link href={"/courses"} className='w-fit'>
                <button className='bg-[#00E785] px-6 md:px-4 py-2.5 md:py-2 rounded-full w-fit mx-auto md:mx-0 hover:bg-[#00d675] transition-colors font-semibold'>
                    Check Our Courses
                </button>
                </Link>
            </div>
            <div className='w-full md:w-auto flex justify-center flex-1'>
                <div className='relative w-full max-w-[400px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[700px] h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]'>
                    <Image 
                        src={'/hero.png'} 
                        fill
                        alt='hero' 
                        className='object-contain'
                        sizes="(max-width: 768px) 400px, (max-width: 1024px) 450px, (max-width: 1280px) 600px, 700px"
                        priority
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero