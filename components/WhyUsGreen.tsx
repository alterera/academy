import Image from 'next/image'
import React from 'react'

const whyUsItems = [
    {
        id: 1,
        icon: "/icons/green-play.svg",
        title: "Interactive Sessions",
        description: "Video-based course make learning engaging."
    },
    {
        id: 2,
        icon: "/icons/green-steps.svg",
        title: "Hands-On Curriculum",
        description: "Structured to ensure you do more than you watch."
    },
    {
        id: 3,
        icon: "/icons/task-green.svg",
        title: "Lifetime Updates",
        description: "Once enrolled, you get unlimited access to the course."
    },
    {
        id: 4,
        icon: "/icons/cert-green.svg",
        title: "Get Certified",
        description: "Earn a certificate upon completing course to highlight your skills."
    },
    {
        id: 5,
        icon: "/icons/free-green.svg",
        title: "Mentorship & Support",
        description: "Get access to dedicated help, personalised feedback."
    },
]

const WhyUsGreen = () => {
  return (
    <div className='w-full py-10 md:py-20 px-4 md:px-0'>
        <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold text-center px-4'>
                Why Alterera Academy?
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-5 pt-10 md:pt-15'>
                {whyUsItems.map((item) => (
                    <div className='flex flex-col items-center gap-2 text-center' key={item.id}>
                        <div className='relative w-[50px] h-[50px] md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px]'>
                            <Image 
                                src={item.icon} 
                                fill
                                alt={item.title}
                                className='object-contain'
                            />
                        </div>
                        <h3 className='font-medium text-base md:text-lg'>{item.title}</h3>
                        <p className='text-[#1d1d1d] text-center text-sm md:text-base nunito'>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default WhyUsGreen