'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

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
import { Input } from '@/components/ui/input'
import { api, baseBackendUrl } from '@/models/axios'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Upload,
  X,
} from 'lucide-react'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination as SwiperPagination,
} from 'swiper/modules'

const Galereya = ({ tab }: { tab: 'rasmlar' | 'videolar' | undefined }) => {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<'rasmlar' | 'videolar'>(
    tab || 'rasmlar'
  )
  const [open, setOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [files, setFiles] = useState<File[]>([])
  const [selectedGallery, setSelectedGallery] = useState<Record<
    string,
    any
  > | null>(null)

  const images = useQuery({
    enabled: activeTab === 'rasmlar',
    queryKey: ['images'],
    queryFn: async () => {
      const response = await api.get('/gallery-item/images', {
        params: {
          page,
          pageSize,
          sort,
        },
      })
      return response.data
    },
  })
  const videos = useQuery({
    enabled: activeTab === 'videolar',
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/gallery-item/videos', {
        params: {
          page,
          pageSize,
          sort,
        },
      })
      return response.data
    },
  })

  const createGalereyaPhoto = useMutation({
    mutationFn: async () => {
      if (!files || files.length === 0) {
        throw new Error('No files selected')
      }

      const formData = new FormData()

      // 👇 backendda field name 'files' bo‘lishi kerak
      files.forEach((file) => {
        formData.append('files', file)
      })

      formData.append('type', 'IMAGE')

      const response = await api.post('/gallery-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },

    onSuccess: () => {
      setOpen(false)
      setFiles([])
    },
  })

  const totalPages = Math.ceil(images.data?.total / pageSize)
  console.log(totalPages)

  return (
    <div className="container-cs py-5 mb-5">
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#0A0A3D] p-1">
            <button
              onClick={() => {
                setActiveTab('rasmlar')
                Cookies.set('admin-gallery-tab', 'rasmlar')
                setPage(1)
                setSort('asc')
              }}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'rasmlar'
                  ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                  : 'text-gray-700 dark:text-white hover:text-gray-900'
              }`}
            >
              {t('Rasmlar')}
            </button>
            <button
              onClick={() => {
                setActiveTab('videolar')
                Cookies.set('admin-gallery-tab', 'videolar')
                setPage(1)
                setSort('asc')
              }}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'videolar'
                  ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                  : 'text-gray-700 dark:text-white hover:text-gray-900'
              }`}
            >
              {t('Videolar')}
            </button>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gray-100 dark:bg-[#0A0A3D] px-5 py-3 text-white"
          >
            Qo'shish
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 max-h-[650px]">
          {activeTab === 'rasmlar' &&
            images.data?.data?.map((item: Record<string, any>) => (
              <motion.div
                key={item?.id}
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
                      src={`${baseBackendUrl}${item?.thumbnailUrl}`}
                      fill
                      unoptimized={process.env.NODE_ENV === 'development'}
                      alt={'Image'}
                      className="object-cover bg-center bg-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                      {item?.url?.length + 1} Photos
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

          {activeTab === 'videolar' &&
            videos.data?.data?.map((item: Record<string, any>) => (
              <motion.div
                key={item?.id}
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
                      src={`${baseBackendUrl}${item?.thumbnailUrl}`}
                      fill
                      unoptimized={process.env.NODE_ENV === 'development'}
                      alt={'Image'}
                      className="object-cover bg-center bg-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                      {item?.url?.length + 1} Photos
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="flex justify-center items-center gap-3">
          {/* First page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1} // birinchi sahifada disable
          >
            <ChevronsLeft />
          </Button>

          {/* Previous page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (page > 1) {
                setPage(page - 1)
              }
            }}
            disabled={page === 1} // birinchi sahifada disable
          >
            <ChevronLeft />
          </Button>

          {/* Page input */}
          <Input
            disabled={totalPages === 1}
            type="number"
            value={page}
            className="w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex justify-center items-center text-center m-0"
            onChange={(e) => setPage(Number(e.target.value))}
          />

          {/* Next page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1)
              }
            }}
            disabled={page === totalPages} // oxirgi sahifada disable
          >
            <ChevronRight />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages} // oxirgi sahifada disable
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
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
                {[selectedGallery?.thumbnailUrl, ...selectedGallery?.url].map(
                  (img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full h-full">
                        <Image
                          src={`${baseBackendUrl}${img}`}
                          alt={`${img}-${idx}`}
                          fill
                          unoptimized={process.env.NODE_ENV === 'development'}
                          className="object-cover bg-center bg-cover"
                        />
                      </div>
                    </SwiperSlide>
                  )
                )}
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
                      const merged = [...prev, ...newFiles]
                      return merged.slice(0, 25) // 👈 maksimal 6 ta fayl
                    })
                  }
                }}
              />
              {files.map((file, index) => (
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
                      const newFiles = [...files]
                      newFiles.splice(index, 1)
                      setFiles(newFiles)
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
