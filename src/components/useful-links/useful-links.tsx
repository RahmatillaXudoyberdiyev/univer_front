'use client'

import 'swiper/css'
import 'swiper/css/scrollbar'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const links = [
    { title: "O'zbekiston Respublikasi Prezidenti", url: '#' },
    { title: "O'zbekiston Respublikasi Vazirlar Mahkamasi", url: '#' },
    { title: 'Samarqand viloyati hokimligi', url: '#' },
    { title: 'Markaziy bank', url: '#' },
    { title: "Davlat statistika qo'mitasi", url: '#' },
    { title: 'Investitsiya kengashi', url: '#' },
    { title: 'Tadbirkorlik subyektlari reyestri', url: '#' },
    { title: 'Elektron hukumat portali', url: '#' },
    { title: 'Davlat xizmatlari markazi', url: '#' },
    { title: "Soliq qo'mitasi", url: '#' },
]

const UsefulLinks = () => {
    return (
        <div className="container-cs py-8">
            <h2 className="font-bold text-2xl mb-6 pb-2 border-b-2 border-[#2B2B7A] w-fit">
                Foydali havolalar
            </h2>

            <Swiper
                modules={[A11y, Autoplay]}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                    1280: { slidesPerView: 4, spaceBetween: 32 },
                }}
                autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
                loop
                className="pb-10"
            >
                {links.map((link, index) => (
                    <SwiperSlide key={index}>
                        <a
                            href={link.url}
                            className="group block h-full"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                className="bg-white dark:bg-[#232351]  rounded-xl border border-gray-200 shadow-sm h-full min-h-20 p-5
                transition-all duration-300
                hover:shadow-md hover:border-[#2B2B7A]/30 flex items-center
                "
                            >
                                <div className="flex items-start gap-3 ">
                                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#2B2B7A]  flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-white"
                                        >
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line
                                                x1="10"
                                                y1="14"
                                                x2="21"
                                                y2="3"
                                            />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-800 group-hover:text-[#2B2B7A] line-clamp-2 dark:text-white">
                                        {link.title}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default UsefulLinks
