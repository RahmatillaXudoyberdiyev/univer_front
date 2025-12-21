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
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import placeholderImage from '../../../public/image.png'
import { BreadcrumbSection } from '../breadcrumb-section/breadcrumb-section'

const AnnouncementsExtended = () => {
    const totalCards = 1500
    const cardsPerPage = 20
    const totalPages = Math.ceil(totalCards / cardsPerPage)
    const [currentPage, setCurrentPage] = useState(1)
    const t = useTranslations()

    const startIndex = (currentPage - 1) * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const currentCards = Array.from({ length: totalCards }).slice(
        startIndex,
        endIndex
    )

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="container-cs py-5 mb-5">
            <div className="mb-8">
                <BreadcrumbSection
                    prevPagesPaths={['/']}
                    prevPages={['Bosh sahifa']}
                    currentPage={"E'lonlar"}
                />
                <h1 className="mt-4 text-4xl font-black uppercase tracking-wider text-[#2B2B7A] dark:text-white">
                    Matbuot xizmati
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Muhim e'lonlar
                </p>
            </div>
            <div>
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg bg-gray-100 p-1">
                        {[
                            { label: t('Yangiliklar'), href: '/news' },
                            { label: t('Tadbirlar'), href: '/events' },
                            { label: t('Elonlar'), href: '/announcements' },
                        ].map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                    tab.href === '/announcements'
                                        ? 'bg-white text-[#2B2B7A] shadow-sm'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {currentCards.map((_, index) => (
                        <motion.div
                            key={startIndex + index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: 'spring',
                                stiffness: 300,
                            }}
                            className="flex flex-col"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="aspect-video w-full overflow-hidden bg-gray-200 rounded-lg">
                                <Link href="">
                                    <Image
                                        src={placeholderImage}
                                        alt=""
                                        className="mb-3 rounded"
                                    />
                                </Link>
                            </div>
                            <p className="pt-2 text-[#76767A] text-sm">
                                18.11.2025, 11:38
                            </p>
                            <Link href="">
                                <h2 className="font-bold text-lg mt-1 line-clamp-2">
                                    Today marks 34 years since the adoption of
                                    the Law..
                                </h2>
                            </Link>
                            <p className="pt-2 text-gray-600 line-clamp-3">
                                Our State Flag is a symbol of our national
                                identity and one of the main emblems that
                                represents the name ...
                            </p>
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

export default AnnouncementsExtended
