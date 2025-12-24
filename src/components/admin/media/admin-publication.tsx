'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useNotify from '@/hooks/use-notify'
import { api, baseBackendUrl } from '@/models/axios'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { PlusCircle, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import 'react-quill-new/dist/quill.snow.css'
import AdminPublicationList from './admin-publication-list'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-75 w-full bg-muted animate-pulse rounded-md" />
  ),
})

interface FileWithPreview extends File {
  preview?: string
}

interface ExistingFile {
  url: string
  preview: string
  name: string
  type: string
}

type SelectedFile = FileWithPreview | ExistingFile

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toastError, toastSuccess } = useNotify()
  const queryClient = useQueryClient()
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(
    null
  )

  const form = useForm<FormValues>({
    defaultValues: {
      titles: { uz: '', oz: '', ru: '', en: '' },
      contents: { uz: '', oz: '', ru: '', en: '' },
    },
  })

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'link'],
        ['clean'],
      ],
    }),
    []
  )

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
      if ('preview' in target && !('url' in target)) {
        URL.revokeObjectURL(target.preview!)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
      selectedFiles.forEach((file) => {
        if ('preview' in file && !('url' in file)) {
          URL.revokeObjectURL(file.preview!)
        }
      })
      setSelectedFiles([])
      form.reset({
        titles: { uz: '', oz: '', ru: '', en: '' },
        contents: { uz: '', oz: '', ru: '', en: '' },
      })
      setSelectedLanguage('uz')
      setEditingItem(null)
    }
    setAddModalOpen(open)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true)

      const formData = new FormData()

      const newFiles = selectedFiles.filter(
        (file): file is FileWithPreview => !('url' in file)
      )
      newFiles.forEach((file) => {
        formData.append('files', file)
      })

      const existingUrls = selectedFiles
        .filter((file): file is ExistingFile => 'url' in file)
        .map((file) => file.url)

      const payload = {
        titles: data.titles,
        contents: data.contents,
        type: activeTab.toUpperCase(),
        existingFiles: existingUrls,
      }

      formData.append('data', JSON.stringify(payload))

      if (editingItem) {
        await api.put(`/publication/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toastSuccess('Muvaffaqiyatli yangilandi')
      } else {
        await api.post('/publication/create-posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toastSuccess('Muvaffaqiyatli saqlandi')
      }

      queryClient.invalidateQueries({ queryKey: ['publications'] })
      handleModalClose(false)
    } catch (err) {
      toastError('Xatolik yuz berdi')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Editing item o'zgarganda form va fayllarni to'ldirish
  useEffect(() => {
    if (editingItem) {
      // Barcha tillar uchun qiymatlarni set qilish
      ;(['uz', 'oz', 'ru', 'en'] as Language[]).forEach((lang) => {
        form.setValue(`titles.${lang}`, editingItem.titles?.[lang] ?? '')
        form.setValue(`contents.${lang}`, editingItem.contents?.[lang] ?? '')
      })

      // Fayllarni yuklash
      const existingFiles: ExistingFile[] = (editingItem.url || []).map(
        (u: string) => ({
          url: u,
          preview: `${baseBackendUrl}${u}`,
          name: u.split('/').pop() || '',
          type:
            u.toLowerCase().includes('.mp4') ||
            u.toLowerCase().includes('.webm')
              ? 'video/'
              : 'image/',
        })
      )

      setSelectedFiles(existingFiles)

      // Modalni ochish
      setAddModalOpen(true)
    }
  }, [editingItem, form])

  return (
    <div className="container-cs py-5 mb-5 text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#0A0A3D] p-1 gap-1">
          {(['news', 'events', 'announcements'] as const).map((tName) => (
            <button
              key={tName}
              onClick={() => {
                setActiveTab(tName)
                Cookies.set('admin-publication-tab', tName)
              }}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors capitalize ${
                activeTab === tName
                  ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                  : 'text-gray-700 dark:text-white hover:text-gray-900'
              }`}
            >
              {t(tName)}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Qo'shish
        </Button>
      </div>

      <AdminPublicationList
        activeTab={activeTab}
        setEditingItem={setEditingItem}
      />

      <Dialog
        open={addModalOpen || !!editingItem}
        onOpenChange={handleModalClose}
      >
        <DialogContent className="md:max-w-5xl flex flex-col h-[85vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle /> {editingItem ? t('Tahrirlash') : t('Yangi')}{' '}
              {activeTab}
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-4">
                <Label>{t('Media fayllar')}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-secondary cursor-pointer"
                  >
                    {t('Fayl tanlash')}
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
                {selectedFiles?.length > 0 && (
                  <ul className="grid grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="relative group border rounded-md overflow-hidden bg-muted"
                      >
                        {'preview' in file && file.preview ? (
                          <img
                            src={file.preview}
                            alt=""
                            className="w-full h-24 object-cover"
                          />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center bg-muted text-xs">
                            Video/File
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-4">
                <Label>{t('Sarlavha va kontent')}</Label>
                <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
                  {(['uz', 'oz', 'ru', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                        selectedLanguage === lang
                          ? 'bg-background shadow-sm'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 bg-background border rounded-xl p-4 shadow-sm">
                  {/* Sarlavha — har bir til uchun alohida Controller */}
                  {(['uz', 'oz', 'ru', 'en'] as Language[]).map((lang) => (
                    <div
                      key={`title-${lang}`}
                      className={selectedLanguage === lang ? 'block' : 'hidden'}
                    >
                      <Controller
                        name={`titles.${lang}`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={`Sarlavha kiriting... (${lang.toUpperCase()})`}
                            className="text-lg font-bold border-none px-0 focus-visible:ring-0"
                          />
                        )}
                      />
                    </div>
                  ))}

                  {/* Kontent — har bir til uchun alohida Controller */}
                  {(['uz', 'oz', 'ru', 'en'] as Language[]).map((lang) => (
                    <div
                      key={`content-${lang}`}
                      className={selectedLanguage === lang ? 'block' : 'hidden'}
                    >
                      <div className="min-h-100">
                        <Controller
                          name={`contents.${lang}`}
                          control={form.control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              value={field.value || ''}
                              onChange={field.onChange}
                              modules={modules}
                              placeholder="Ma'lumot matnini bu yerga yozing..."
                            />
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-background">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleModalClose(false)}
              >
                {t('Bekor qilish')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-size: 16px;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--muted) / 0.3);
          padding: 8px !important;
        }
        .ql-editor {
          min-height: 320px;
          padding: 1.5rem 0 !important;
        }
        .ql-editor.ql-blank::before {
          left: 0 !important;
          font-style: normal !important;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  )
}

export default AdminPublication
