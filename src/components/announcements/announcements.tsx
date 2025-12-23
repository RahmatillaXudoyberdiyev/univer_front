'use client'

import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/scrollbar'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../public/image.png'
import { Button } from '../ui/button'

const Announcements = () => {
    const t = useTranslations()
    const locale = useLocale()
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1248'

    const { data: announcements } = useQuery({
        queryKey: ['announcements-home'],
        queryFn: async () => {
            const response = await api.get('/publication')
            const filtered = Array.isArray(response.data)
                ? response.data.filter(
                      (item: any) => item.type?.toLowerCase() === 'announcements'
                  )
                : []
            return filtered.reverse()
        },
    })

    const getLocalizedValue = (obj: any) => {
        if (!obj) return ''
        return obj[locale] || obj['uz'] || obj['en'] || Object.values(obj)[0] || ''
    }

    const handleLinkClick = () => {
        Cookies.set('publication-tab', 'announcements')
    }

    return (
        <div className="container-cs mb-5">
            <div className="flex justify-between items-center py-5">
                <h1 className="font-bold text-2xl mb-6 pb-2 border-b-2 border-[#2B2B7A] w-fit">
                    {t('Elonlar')}
                </h1>
                <Button variant="ghost" asChild onClick={handleLinkClick}>
                    <Link href="/publication">{t('Barcha Elonlar')}</Link>
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
                autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
                loop
            >
                {announcements?.map((item: any) => (
                    <SwiperSlide key={item.id}>
                        <div className="aspect-video w-full overflow-hidden bg-gray-200 rounded-lg">
                            <Link href={`/publication/${item.id}`} onClick={handleLinkClick}>
                                <Image
                                    src={item.url?.[0] ? `${baseUrl}${item.url[0]}` : placeholderImage}
                                    alt=""
                                    width={500}
                                    height={300}
                                    unoptimized
                                    className="mb-5 object-cover w-full h-full"
                                />
                            </Link>
                        </div>

                        <div className="pt-4">
                            <p className="text-[#76767A]">
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString(locale, {
                                          year: 'numeric',
                                          month: 'numeric',
                                          day: 'numeric',

                                          hour: 'numeric',
                                          minute: 'numeric',
                                          hour12: false,
                                      })
                                    : ''
                                }
                            </p>
                            <Link href={`/publication/${item.id}`} onClick={handleLinkClick} >
                                <p className="font-bold text-lg mb-6 line-clamp-2">
                                    {getLocalizedValue(item.title) || t('Sarlavha mavjud emas')}
                                </p>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Announcements
