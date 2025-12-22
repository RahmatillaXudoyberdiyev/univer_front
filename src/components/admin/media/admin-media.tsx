'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useNotify from '@/hooks/use-notify'
import { api } from '@/models/axios'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import AdminNews from './admin-news'

interface FileWithPreview extends File {
  preview?: string
}

type Language = 'uz' | 'oz' | 'ru' | 'en'

type FormValues = {
  titles: Record<Language, string>
  contents: Record<Language, string>
}

const AdminPublication = ({
  tab,
}: {
  tab: 'news' | 'events' | 'announcements' | undefined
}) => {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<
    'news' | 'events' | 'announcements'
  >(tab || 'news')
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('uz')
  const { toastError, toastSuccess } = useNotify()
  const queryClient = useQueryClient()
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])

  const form = useForm<FormValues>({
    defaultValues: {
      titles: { uz: '', oz: '', ru: '', en: '' },
      contents: { uz: '', oz: '', ru: '', en: '' },
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFilesArr = Array.from(files)
    const processedFiles: FileWithPreview[] = newFilesArr.map((file) => {
      const fileWithPreview = file as FileWithPreview
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }
      return fileWithPreview
    })

    setSelectedFiles((prev) => [...prev, ...processedFiles].slice(0, 25))
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const target = prev[index]
      if (target.preview) URL.revokeObjectURL(target.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
      selectedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
      setSelectedFiles([])
      form.reset()
      setSelectedLanguage('uz')
    }
    setAddModalOpen(open)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      formData.append('data', JSON.stringify(data))

      await api.post('/publication/create-news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toastSuccess('Muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: ['news'] })
      handleModalClose(false)
    } catch (err) {
      toastError('Xatolik yuz berdi')
    }
  }

  return (
    <div className="container-cs py-5 mb-5">
      <div className="flex justify-between items-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#0A0A3D] p-1">
          <button
            onClick={() => {
              setActiveTab('news')
              Cookies.set('admin-publication-tab', 'news')
            }}
            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'news'
                ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                : 'text-gray-700 dark:text-white'
            }`}
          >
            {t('Yangiliklar')}
          </button>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-3"
        >
          Qo'shish
        </button>
      </div>

      {activeTab === 'news' && <AdminNews activeTab={activeTab} />}

      <Dialog open={addModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="md:max-w-5xl flex flex-col h-[80vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Yangi ma'lumot qo'shish</DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 px-1">
              <div className="space-y-4 mb-8">
                <Label>Media fayllar (Rasm yoki Video)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Fayllarni tanlang
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    Fayl tanlash
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="relative group border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                      >
                        {file.preview ? (
                          file.type.startsWith('image/') ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <video
                              src={file.preview}
                              className="w-full h-32 object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Upload className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-6">
                <Label>Til</Label>
                <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 mt-2 rounded-lg">
                  {(['uz', 'oz', 'ru', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {lang === 'uz'
                        ? "O'zbekcha"
                        : lang === 'oz'
                        ? "O'zbekcha (Kirill)"
                        : lang === 'ru'
                        ? 'Русский'
                        : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <Label>Sarlavha ({selectedLanguage.toUpperCase()})</Label>
                  <Input
                    {...form.register(`titles.${selectedLanguage}`)}
                    placeholder="Sarlavha..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Kontent ({selectedLanguage.toUpperCase()})</Label>
                  <Textarea
                    {...form.register(`contents.${selectedLanguage}`)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={() => handleModalClose(false)}
                className="px-6 py-2 text-sm font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Saqlash
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPublication
