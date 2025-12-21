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
import { X } from 'lucide-react' // For a close button
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

const videoData = [
    { id: 1, youtubeId: 'b9C7KzLpSYQ', title: 'Video 1' },
    { id: 2, youtubeId: '-IW0rgRCvu4', title: 'Video 2' },
    { id: 3, youtubeId: '2XRnQtQ0l64', title: 'Video 3' },


]

const VideoGallery = () => {
    const totalCards = 50
    const cardsPerPage = 12
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

    const currentCards = videoData.slice(startIndex, endIndex)

    const totalPages = Math.ceil(videoData.length / cardsPerPage)
    const t = useTranslations()

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }
    return (
        <div className="container-cs py-5 mb-5">
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                            {
                                label: t('Videolar'),
                                href: '/galereya/videolar',
                            },
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
                    {currentCards.map((video) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            whileHover={{ scale: 1.02 }}
                            className="flex flex-col cursor-pointer group"
                            onClick={() => setSelectedVideo(video.youtubeId)}
                        >
                            <div className="relative overflow-hidden rounded-xl aspect-video bg-gray-200">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-[#2B2B7A] border-b-8 border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    className={`cursor-pointer ${
                                        currentPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }`}
                                />
                            </PaginationItem>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => {
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 &&
                                        page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                isActive={page === currentPage}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                }
                                if (
                                    (page === currentPage - 2 &&
                                        currentPage > 3) ||
                                    (page === currentPage + 2 &&
                                        currentPage < totalPages - 2)
                                ) {
                                    return (
                                        <PaginationItem
                                            key={`ellipsis-${page}`}
                                        >
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }
                                return null
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    className={`cursor-pointer ${
                                        currentPage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default VideoGallery
