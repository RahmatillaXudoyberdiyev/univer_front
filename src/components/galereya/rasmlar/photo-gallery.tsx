'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../../public/image.png'
import { useQuery } from '@tanstack/react-query'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {
    A11y,
    Autoplay,
    Navigation,
    Pagination as SwiperPagination,
} from 'swiper/modules'
import { api } from '@/models/axios'

const PhotoGallery = () => {
    const t = useTranslations()
    const [selectedGallery, setSelectedGallery] = useState<any | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12
    const activeTab = 'rasmlar'
    const sort = 'desc'

    const { data, isLoading } = useQuery({
        enabled: activeTab === 'rasmlar',
        queryKey: ['images', activeTab, currentPage, pageSize, sort],
        queryFn: async () => {
            const response = await api.get('/gallery-item/images', {
                params: {
                    page: currentPage,
                    pageSize,
                    sort,
                },
            })
            return response.data
        },
    })

    // Correctly pathing to the data and total count
    const photoItems = data?.data || []
    const totalItems = data?.total || 0
    const totalPages = Math.ceil(totalItems / pageSize) || 1

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    if (isLoading) return <div className="text-center py-20">Loading...</div>

    return (
        <div className="container-cs py-5 mb-5">
            <div>
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#0A0A3D] p-1">
                        {[
                            { label: t('Rasmlar'), href: '/galereya/rasmlar' },
                            { label: t('Videolar'), href: '/galereya/videolar' },
                        ].map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                    tab.href === '/galereya/rasmlar'
                                        ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                                        : 'text-gray-700 dark:text-white hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {photoItems.map((item: any) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="flex flex-col cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedGallery(item)}
                        >
                            <div className="relative group overflow-hidden rounded-lg">
                                <div className="aspect-video w-full relative overflow-hidden bg-gray-200 rounded-lg">
                                    <Image
                                        // Using the first image in the url array as the thumbnail
                                        src={item.url?.[0] || placeholderImage}
                                        alt={item.title || 'Gallery Image'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                                        {item.url?.length || 0} Photos
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={page === currentPage}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    }
                                    return null
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedGallery(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedGallery(null)}
                                className="absolute top-4 right-4 z-[110] text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <Swiper
                                modules={[SwiperPagination, Navigation, A11y, Autoplay]}
                                navigation
                                pagination={{ clickable: true }}
                                className="w-full h-full"
                                loop
                            >
                                {selectedGallery.url?.map((img: string, idx: number) => (
                                    <SwiperSlide key={idx}>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`Gallery image ${idx + 1}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PhotoGallery
