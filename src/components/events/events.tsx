'use client'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import { A11y, Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../public/image.png'
import { Button } from '../ui/button'


const Events = () => {
    return (
        <div className="container-cs mb-5">
            <div className="flex justify-between items-center py-5">
                <h1 className="font-bold text-2xl mb-6 pb-2 border-b-2 border-[#2B2B7A] w-fit">
                    Barcha Tadbirlar
                </h1>
                <Button variant="ghost" asChild>
                    <Link href="">So'nggi tadbirlar</Link>
                </Button>
            </div>
            <Swiper
                modules={[A11y, Autoplay]}
                slidesPerView={1}
                breakpoints={{
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 2, spaceBetween: 10 },
                    1280: { slidesPerView: 3, spaceBetween: 20 },
                }}
                loop
                autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
            >
                {Array.from({ length: 10 }).map((_, index) => (
                    <SwiperSlide>
                        <Image
                            src={placeholderImage}
                            alt=""
                            width={500}
                            className="mb-5 object-cover"
                        />
                        <div className="h-20px">
                            <p className="text-[#76767A]">18.11.2025, 11:38</p>
                            <p className="font-bold text-lg mb-6">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Quos, quia.
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Events
