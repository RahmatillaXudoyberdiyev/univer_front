'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import 'swiper/css'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Slide {
  id: number
  title: string
  date: string
  image: any
}

interface HeroSectionProps {
  slides: Slide[]
}

const HeroSection = ({ slides }: HeroSectionProps) => {
  return (
    <div className="mb-5">
      <Swiper
        modules={[A11y, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
        loop
        className="w-full h-screen"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="relative w-full h-full before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-10">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                loading="eager"
              />
            </div>

            <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 lg:px-32 text-white max-w-5xl">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                {slide.title}
              </h2>

              <div className="flex items-center gap-6">
                <Button
                  variant="default"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-6 text-lg rounded-md"
                >
                  Batafsil
                </Button>

                <div className="flex items-center gap-2 text-sm md:text-base font-medium opacity-90">
                  <Calendar className="w-4 h-4" />
                  {slide.date}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSection
