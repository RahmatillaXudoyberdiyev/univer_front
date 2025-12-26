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
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'

const VideoGallery = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const pageSize = 12
    const activeTab = 'videolar'
    const sort = 'desc'

    const { data, isLoading } = useQuery({
        enabled: activeTab === 'videolar',
        queryKey: ['videos', activeTab, currentPage, pageSize, sort],
        queryFn: async () => {
            const response = await api.get('/gallery-item/videos', {
                params: {
                    page: currentPage,
                    pageSize,
                    sort,
                },
            })
            return response.data 
        },
    })

    const videos = data?.data || []
    const totalItems = data?.total || 0
    const totalPages = Math.ceil(totalItems / pageSize) || 1

    const t = useTranslations()

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    if (isLoading) return <div className="text-center py-20">Loading...</div>

    return (
        <div className="container-cs py-5 mb-5">
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full z-10"
                            >
                                <X size={24} />
                            </button>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    tab.href === '/galereya/videolar'
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
                    {videos.map((video: any) => {
                        const youtubeId = video.url?.[0]

                        return (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                whileHover={{ scale: 1.02 }}
                                className="flex flex-col cursor-pointer group"
                                onClick={() => setSelectedVideo(youtubeId)}
                            >
                                <div className="relative overflow-hidden rounded-xl aspect-video bg-gray-200">
                                    <img
                                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                        alt={video.title || "Gallery Video"}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-[#2B2B7A] border-b-8 border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
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
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
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
        </div>
    )
}

export default VideoGallery
