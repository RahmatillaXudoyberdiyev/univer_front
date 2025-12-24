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
import { Textarea } from '@/components/ui/textarea'
import useNotify from '@/hooks/use-notify'
import { api } from '@/models/axios'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Type,
  Upload,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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

  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  const form = useForm<FormValues>({
    defaultValues: {
      titles: { uz: '', oz: '', ru: '', en: '' },
      contents: { uz: '', oz: '', ru: '', en: '' },
    },
  })

  const applyMarkdown = (
    prefix: string,
    suffix: string = '',
    defaultValue: string = ''
  ) => {
    const el = textareaRefs.current[selectedLanguage]
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const text = el.value
    const selectedText = text.substring(start, end) || defaultValue

    const before = text.substring(0, start)
    const after = text.substring(end)

    const newValue = `${before}${prefix}${selectedText}${suffix}${after}`

    form.setValue(`contents.${selectedLanguage}`, newValue)

    setTimeout(() => {
      el.focus()
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      )
    }, 0)
  }

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
      selectedFiles.forEach((file) => formData.append('files', file))
      formData.append('data', JSON.stringify(data))

      await api.post('/publication/create-news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toastSuccess('Muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: ['news'] })
      handleModalClose(false)
    } catch (err) {
      toastError('Xatolik yuz berdi')
    }
  }

  const { ref: contentRef, ...contentRest } = form.register(
    `contents.${selectedLanguage}`
  )

  return (
    <div className="container-cs py-5 mb-5 text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <button
            onClick={() => {
              setActiveTab('news')
              Cookies.set('admin-publication-tab', 'news')
            }}
            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'news'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            {t('Yangiliklar')}
          </button>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Qo'shish
        </Button>
      </div>

      {activeTab === 'news' && <News activeTab={activeTab} />}

      <Dialog open={addModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="md:max-w-5xl flex flex-col h-[85vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Yangi ma'lumot qo'shish</DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-4">
                <Label>Media fayllar</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-secondary cursor-pointer"
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
                  <ul className="grid grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="relative group border rounded-md overflow-hidden bg-muted"
                      >
                        {file.preview && file.type.startsWith('image/') ? (
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
                <Label>Til va Tarkib</Label>
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
                  <Input
                    {...form.register(`titles.${selectedLanguage}`)}
                    placeholder="Sarlavha kiriting..."
                    className="text-lg font-bold border-none px-0 focus-visible:ring-0"
                  />

                  <div className="flex flex-wrap items-center gap-1 border-y py-2 bg-muted/30 -mx-4 px-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('**', '**', 'bold text')}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('*', '*', 'italic text')}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('# ', '', 'Heading')}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        applyMarkdown('[', '](https://)', 'link text')
                      }
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <div className="w-[1px] h-4 bg-border mx-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('- ', '', 'list item')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('1. ', '', 'ordered item')}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyMarkdown('> ', '', 'blockquote')}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        applyMarkdown(
                          '\n| Header | Header |\n| ------ | ------ |\n| Cell | Cell |',
                          '',
                          ''
                        )
                      }
                    >
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    {...contentRest}
                    ref={(e) => {
                      contentRef(e)
                      textareaRefs.current[selectedLanguage] = e
                    }}
                    placeholder="Ma'lumot matnini bu yerga yozing..."
                    rows={12}
                    className="border-none px-0 focus-visible:ring-0 resize-none min-h-[300px] font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalClose(false)}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                Saqlash
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPublication
