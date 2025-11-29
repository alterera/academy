import Image from 'next/image'
import React from 'react'

const Newspaper = () => {
  return (
    <div className='w-full bg-[#cafde8]'>
        <div className='bg-green-400'>
        <Image src={'/shapes/wave-g2.svg'} height={100} width={100} alt='wave' className='w-full h-40 rotate-180 opacity-20'/>
        </div>
        <Image src={'/shapes/wave-g1.svg'} height={100} width={100} alt='wave' className='w-full h-40'/>
    </div>
  )
}

export default Newspaper