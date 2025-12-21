'use client'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../public/image.png'
import { Button } from '../ui/button'

const Events = () => {
    const t = useTranslations()
    return (
        <div className="container-cs mb-5">
            <div className="flex justify-between items-center py-5">
                <h1 className="font-bold text-2xl mb-6 pb-2 border-b-2 border-[#2B2B7A] w-fit">
                    {t('Tadbirlar')}
                </h1>
                <Button variant="ghost" asChild>
                    <Link href="/events">{t('Barcha Tadbirlar')}</Link>
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
                        <div className="aspect-video w-full overflow-hidden bg-gray-200 rounded-lg">
                            <Link href="">
                                <Image
                                    src={placeholderImage}
                                    alt=""
                                    width={500}
                                    className="mb-5 object-cover"
                                />
                            </Link>
                        </div>

                        <div className="h-20px">
                            <p className="text-[#76767A]">18.11.2025, 11:38</p>
                            <Link href="">
                            <p className="font-bold text-lg mb-6">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Quos, quia.
                            </p>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Events
