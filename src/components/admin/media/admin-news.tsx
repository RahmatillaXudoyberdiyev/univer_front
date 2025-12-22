'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { api } from '@/models/axios'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import placeholderImage from '../../../../public/image.png'

const AdminNews = ({ activeTab }: { activeTab: string }) => {
  const totalCards = 50
  const cardsPerPage = 20
  const totalPages = Math.ceil(totalCards / cardsPerPage)
  const [currentPage, setCurrentPage] = useState<number>(1)
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

  const newsData = useQuery({
    enabled: activeTab === 'news',
    queryKey: ['news'],
    queryFn: async () => {
      const response = await api.get('/publication')
      return response.data
    },
  })

  return (
    <div>
      <div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {startIndex === 0 && (
          <div className="md:col-span-2 relative">
            <Link href="">
              <div className="before:absolute before:inset-0 before:bg-black/50 before:z-10"></div>
            </Link>
            <div className="absolute bottom-5 left-5 right-5 text-white  z-15 p-5 ">
              <p className=" p-2 text-white bg-gray-200/30 w-fit rounded">
                18.11.2025, 11:38
              </p>
              <Link href="">
                <h1 className="font-bold text-2xl">
                  Today marks 34 years since the adoption of the Law..
                </h1>
              </Link>

              <p className="text-xl pt-2">
                Our State Flag is a symbol of our national identity and one of
                the main emblems that represents the name ...
              </p>
            </div>
            <Image src={placeholderImage} alt="" />
          </div>
        )}
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
                <Image src={placeholderImage} alt="" className="mb-3 rounded" />
              </Link>
            </div>
            <p className="pt-2 text-[#76767A] text-sm">18.11.2025, 11:38</p>
            <Link href="">
              <h2 className="font-bold text-lg mt-1 line-clamp-2">
                Today marks 34 years since the adoption of the Law..
              </h2>
            </Link>
            <p className="pt-2 text-gray-600 line-clamp-3">
              Our State Flag is a symbol of our national identity and one of the
              main emblems that represents the name ...
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`cursor-pointer ${
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }`}
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
              if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={`ellipsis-${page}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
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
  )
}

export default AdminNews
