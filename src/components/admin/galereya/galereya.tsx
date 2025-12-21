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
import { useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import placeholderImage from '../../../../public/image.png'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/models/axios'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { Upload, X } from 'lucide-react'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination as SwiperPagination,
} from 'swiper/modules'

const photoData: Record<string, any>[] = [
  {
    id: 1,
    alt: 'Gallery 1',
    images: ['/image1.jpg', '/image2.jpg', '/image3.jpg'],
  },
  {
    id: 2,
    alt: 'Gallery 2',
    images: Array.from({ length: 25 }).map((_, i) => `/image${i + 1}.jpg`),
  },
  {
    id: 3,
    alt: 'Gallery 3',
    images: ['/image3.jpg', '/image2.jpg'],
  },
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: i + 4,
    alt: `Gallery ${i + 4}`,
    images: ['/image1.jpg', '/image2.jpg'],
  })),
]

const Galereya = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<FileList | null>(null)

  const [selectedGallery, setSelectedGallery] = useState<
    (typeof photoData)[0] | null
  >(null)
  const totalCards = photoData.length
  const cardsPerPage = 12
  const totalPages = Math.ceil(totalCards / cardsPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * cardsPerPage
  const currentCards = useMemo(
    () =>
      photoData.slice(
        (currentPage - 1) * cardsPerPage,
        currentPage * cardsPerPage
      ),
    [currentPage, photoData]
  )

  const t = useTranslations()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const createGalereyaPhoto = useMutation({
    mutationFn: async () => {
      if (!files || files.length === 0) {
        throw new Error('No files selected')
      }

      const formData = new FormData()
      console.log(files)

      Array.from(files).forEach((file) => {
        formData.append('files', file)
      })

      formData.append('type', 'PHOTO')

      // ❌ Qo‘lda Content-Type bermang, axios avtomatik belgilaydi
      const response = await api.post('/gallery-item', formData)
      return response.data
    },

    onSuccess: () => {
      setOpen(false)
      setFiles(null)
    },
  })

  return (
    <div className="container-cs py-5 mb-5">
      <div>
        <div className="flex justify-between items-center mb-8">
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
                  tab.href === '/galereya/rasmlar'
                    ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                    : 'text-gray-700 dark:text-white hover:text-gray-900'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gray-100 dark:bg-[#0A0A3D] px-5 py-3 text-white"
          >
            Qo'shish
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {currentCards.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="flex flex-col cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedGallery(item)}
            >
              <div className="relative group overflow-hidden rounded-lg ">
                <div className="aspect-video w-full overflow-hidden bg-gray-200 rounded-lg">
                  <Image
                    src={placeholderImage}
                    alt={item.alt}
                    className=" object-cover"
                    priority={currentPage === 1 && item.id <= 6}
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {item.images.length} Photos
                  </span>
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
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`cursor-pointer ${
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
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
                }
              )}
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
      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
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
                className="absolute top-4 right-4 z-110 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                {selectedGallery.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full">
                      <Image
                        src={placeholderImage}
                        alt={`${selectedGallery.alt}-${idx}`}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Qo'shish</DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
          <div className="w-full">
            <div className="flex justify-start items-center gap-3 flex-wrap w-full">
              <label htmlFor="files">
                <div className="w-24 h-24 border-2 rounded-lg flex items-center justify-center border-dashed">
                  <Upload className="text-stone-500" />
                </div>
              </label>
              <input
                type="file"
                name="files"
                id="files"
                accept="image/*"
                className="hidden"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files)
                    setFiles((prev) => {
                      if (prev && prev.length >= 6) {
                        return prev
                      }
                      return prev
                        ? [...Array.from(prev), ...newFiles]
                        : (newFiles as any)
                    })
                  }
                }}
              />
              {files &&
                Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border-2 rounded-lg flex items-center justify-center border-dashed"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`file-${index}`}
                      width={100}
                      height={100}
                      className="object-contain bg-contain w-full h-full"
                    />
                    <button
                      onClick={() => {
                        const newFiles = Array.from(files)
                        newFiles.splice(index, 1)
                        setFiles(newFiles as any)
                      }}
                      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-white bg-red-500 hover:bg-red-600 p-1 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
            </div>
            <Button onClick={() => createGalereyaPhoto.mutate()}>
              Qo'shish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Galereya
