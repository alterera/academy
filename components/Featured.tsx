import Image from 'next/image'
import React from 'react'

const Featured = () => {
  return (
    <div className='hidden md:block w-full bg-[#fdecff] py-10 md:py-20 px-4 md:px-0'>
        <div className='max-w-6xl mx-auto'>
            <h2 className='text-xl md:text-2xl lg:text-3xl text-center font-bold px-4'>
                Trusted by the fastest growing brands in rapidly developing economies
            </h2>
            <div className='flex justify-center pt-6 md:pt-10 w-full overflow-hidden'>
                <div className='relative w-full max-w-full h-[60px] md:h-[80px] lg:h-[100px]'>
                    <Image 
                        src={'/featured/f-1.png'} 
                        fill
                        alt='company' 
                        className='object-contain'
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Featured