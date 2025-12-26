'use client'

import { Button } from '@/components/ui/button'
import { api, baseBackendUrl } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../public/image.png'

const HeroSection = () => {
  const locale = useLocale()
  const t = useTranslations()

  const { data: slides = [] } = useQuery({
    queryKey: ['hero-news'],
    queryFn: async () => {
      const response = await api.get('/publication')
      const filteredData = Array.isArray(response.data)
        ? response.data.filter(
            (item: any) => item.type?.toLowerCase() === 'news'
          )
        : []
      return filteredData.reverse().slice(0, 3)
    },
  })

  const getLocalizedValue = (obj: any) => {
    if (!obj) return ''
    return obj[locale] || obj['uz'] || obj['en'] || Object.values(obj)[0] || ''
  }

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
    return videoExtensions.some((ext) => url?.toLowerCase().endsWith(ext))
  }

  return (
    <div className="mb-5">
      <div className="w-full h-screen mb-10">
        <video
          src="/logo_video.mp4"
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* <Swiper
        modules={[A11y, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
        loop
        className="w-full h-screen"
      >
        {slides.map((slide: any) => {
          const title = getLocalizedValue(slide.title)
          const date = slide.createdAt
            ? new Date(slide.createdAt).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              })
            : ''
          const mediaUrl = slide.url?.[0]

          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              <div className="relative w-full h-full before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-10">
                {mediaUrl && isVideo(mediaUrl) ? (
                  <video
                    src={`${baseBackendUrl}${mediaUrl}`}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={
                      mediaUrl
                        ? `${baseBackendUrl}${mediaUrl}`
                        : placeholderImage
                    }
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                )}
              </div>

              <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 lg:px-32 text-white max-w-5xl">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                  {title}
                </h2>

                <div className="flex items-center gap-6">
                  <Link
                    href={`/publication/${slide.id}`}
                    onClick={() =>
                      localStorage.setItem('publication-tab', 'news')
                    }
                  >
                    <Button
                      variant="default"
                      className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-6 text-lg rounded-md cursor-pointer"
                    >
                      {t('Batafsil')}
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2 text-sm md:text-base font-medium opacity-90">
                    <Calendar className="w-4 h-4" />
                    {date}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper> */}
    </div>
  )
}

export default HeroSection
