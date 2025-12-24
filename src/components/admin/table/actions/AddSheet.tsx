'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { formatDateForInput, getStringValue, languageNames } from '@/lib/utils'
import { baseBackendUrl } from '@/models/axios'
import { Asterisk, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type LocalizedString = { uz: string; ru: string; en: string; oz: string }
type LocalizedArray = { uz: string[]; ru: string[]; en: string[]; oz: string[] }

type FieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | string[]
  | LocalizedString
  | LocalizedArray

type AddSheetProps = {
  route_name: string
  fields: { name: string; label: string; type: string }[]
  formDataDefaults: Record<string, FieldValue>
}

export const AddSheet = ({
  route_name,
  fields,
  formDataDefaults,
}: AddSheetProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const validate = () => {
    const langs = ['uz', 'oz', 'ru', 'en'] as const

    for (const field of fields) {
      const value = formData[field.name]

      if (
        field.type === 'localized-text' ||
        field.type === 'localized-markdown'
      ) {
        const localized = value as LocalizedString
        for (const lang of langs) {
          if (!localized?.[lang] || localized[lang].trim() === '') {
            showToast(
              `${field.label} (${languageNames[lang]}) is required`,
              'error'
            )
            return false
          }
        }
      } else if (field.type === 'localized-list') {
        const localizedArray = value as LocalizedArray
        for (const lang of langs) {
          const list = localizedArray?.[lang] || []
          const hasValidItem = list.some((item) => item && item.trim() !== '')

          if (!hasValidItem) {
            showToast(
              `Please add at least one ${field.label} for ${languageNames[lang]}`,
              'error'
            )
            return false
          }
        }
      } else if (field.type === 'markdown') {
        if (!value || (value as string).trim() === '') {
          showToast(`${field.label} content is required`, 'error')
          return false
        }
      } else if (field.type === 'date') {
        if (!value) {
          showToast(`${field.label} is required`, 'error')
          return false
        }
      } else if (field.type === 'file-image' || field.type === 'file') {
        if (!value) {
          showToast(`Please upload a ${field.label}`, 'error')
          return false
        }
      } else if (field.type !== 'checkbox') {
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (typeof value === 'number' && isNaN(value))
        ) {
          showToast(`${field.label} is required`, 'error')
          return false
        }
      }
    }
    return true
  }

  const [formData, setFormData] = useState(formDataDefaults)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    const field = fields.find((f) => f.name === name)
    let parsedValue: string | number | Date | null = value

    if (field?.type === 'number') {
      parsedValue = value === '' ? NaN : Number(value)
    } else if (field?.type === 'date') {
      parsedValue = value ? new Date(value) : null
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }))
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    formFieldName: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${baseBackendUrl}/uploads`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { filePath } = await res.json()
        setFormData((prev) => ({ ...prev, [formFieldName]: filePath }))
      } else {
        alert('Image upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading image')
    }
  }

  const handleFileUpload = async (file: File, formFieldName: string) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${baseBackendUrl}/uploads`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { filePath } = await res.json()
        setFormData((prev) => ({ ...prev, [formFieldName]: filePath }))
      } else {
        alert('File upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading file')
    }
  }

  const handleAdd = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => {
          if (typeof val === 'number' && isNaN(val)) return [key, null]
          if (val instanceof Date) return [key, val.toISOString()]
          return [key, val]
        })
      )

      console.log(payload, 'AddSheet', route_name)

      const res = await fetch(`${baseBackendUrl}/${route_name}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showToast('Successfully created!', 'success')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const error = await res.json()
        showToast(error.message || 'Failed to create', 'error')
      }
    } catch (error) {
      console.error('Network error:', error)
      showToast('An error occurred while saving', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleListChange = (
    fieldName: string,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }))
  }

  const addListItem = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] as string[]), ''],
    }))
  }

  const removeListItem = (fieldName: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).filter((_, i) => i !== index),
    }))
  }

  return (
    <Sheet open={isAdding} onOpenChange={setIsAdding}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4">
          <Plus className="h-4 w-4 mr-2" /> Add New{' '}
          {route_name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen px-2">
        <SheetHeader>
          <SheetTitle>
            Add{' '}
            {route_name
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </SheetTitle>
          <SheetDescription>
            Fill in the details for the new {route_name}. Upload an image and
            add translations.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 pt-4 px-1">
          {fields.map((field) =>
            field.type === 'file-image' ? (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                {formData[field.name] ? (
                  <div className="space-y-2">
                    <img
                      src={`${baseBackendUrl}${formData[field.name]}`}
                      alt="Uploaded preview"
                      className="w-20 h-20 rounded object-cover border"
                    />
                    <p className="text-xs text-muted-foreground truncate">
                      {getStringValue(formData[field.name])?.split('/').pop() ??
                        'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No image uploaded
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, field.name)}
                  className="hidden"
                  id={`image-upload-${field.name}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById(`image-upload-${field.name}`)
                      ?.click()
                  }
                >
                  {formData[field.name] ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            ) : field.type === 'file' ? (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                {formData[field.name] ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <a
                        href={`${baseBackendUrl}${formData[field.name]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View/Download File
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {getStringValue(formData[field.name])?.split('/').pop() ??
                        'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No file uploaded
                  </p>
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    handleFileUpload(file, field.name)
                  }}
                  className="hidden"
                  id={`file-upload-${field.name}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById(`file-upload-${field.name}`)
                      ?.click()
                  }
                >
                  {formData[field.name] ? 'Change File' : 'Upload File'}
                </Button>
              </div>
            ) : field.type === 'list' ? (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(formData[field.name] as string[]).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleListChange(field.name, idx, e.target.value)
                        }
                        className="w-40"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => removeListItem(field.name, idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => addListItem(field.name)}
                >
                  + Add {field.label}
                </Button>
              </div>
            ) : field.type === 'date' ? (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={formatDateForInput(formData[field.name])}
                  onChange={handleInputChange}
                />
              </div>
            ) : field.type === 'markdown' ? (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={(formData[field.name] as string) ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  rows={6}
                  className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder={`Enter ${field.label.toLowerCase()} in Markdown...`}
                />
              </div>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center gap-3" key={field.name}>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: !(prev[field.name] as boolean),
                    }))
                  }
                  className={`relative flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                    formData[field.name]
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {formData[field.name] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium cursor-pointer flex"
                >
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
              </div>
            ) : field.type === 'localized-text' ? (
              <div key={field.name} className="space-y-3">
                <Label className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                {(['uz', 'oz', 'ru', 'en'] as const).map((lang) => {
                  const localized = formData[field.name] as
                    | LocalizedString
                    | undefined

                  return (
                    <div key={lang} className="flex items-start gap-5">
                      <span className="mt-2 text-xs font-medium w-14">
                        {languageNames[lang]}
                      </span>
                      <Input
                        value={localized?.[lang] ?? ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: {
                              ...(prev[field.name] as LocalizedString),
                              [lang]: e.target.value,
                            },
                          }))
                        }
                        placeholder={`Enter in ${languageNames[lang]}`}
                        className="flex-1"
                      />
                    </div>
                  )
                })}
              </div>
            ) : field.type === 'localized-markdown' ? (
              <div key={field.name} className="space-y-4">
                <Label className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                {(['uz', 'oz', 'ru', 'en'] as const).map((lang) => {
                  const localized = formData[field.name] as
                    | LocalizedString
                    | undefined

                  return (
                    <div key={lang} className="border rounded-md p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        {languageNames[lang]}
                      </div>
                      <textarea
                        value={localized?.[lang] ?? ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: {
                              ...(prev[field.name] as LocalizedString),
                              [lang]: e.target.value,
                            },
                          }))
                        }
                        rows={5}
                        className="w-full font-mono text-sm rounded border px-3 py-2"
                        placeholder={`Markdown in ${languageNames[lang]}...`}
                      />
                    </div>
                  )
                })}
              </div>
            ) : field.type === 'localized-list' ? (
              <div key={field.name} className="space-y-4">
                <Label className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                {(['uz', 'oz', 'ru', 'en'] as const).map((lang) => {
                  const list =
                    (formData[field.name] as LocalizedArray | undefined)?.[
                      lang
                    ] || []
                  return (
                    <div key={lang} className="border rounded-md p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {languageNames[lang]}
                      </div>
                      <div className="space-y-2">
                        {list.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) =>
                                setFormData((prev) => {
                                  const newList = [...list]
                                  newList[idx] = e.target.value
                                  return {
                                    ...prev,
                                    [field.name]: {
                                      ...(prev[field.name] as LocalizedArray),
                                      [lang]: newList,
                                    },
                                  }
                                })
                              }
                              placeholder={`Item ${idx + 1}`}
                              className="flex-1"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setFormData((prev) => {
                                  const newList = list.filter(
                                    (_, i) => i !== idx
                                  )
                                  return {
                                    ...prev,
                                    [field.name]: {
                                      ...(prev[field.name] as LocalizedArray),
                                      [lang]: newList,
                                    },
                                  }
                                })
                              }
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit"
                          onClick={() =>
                            setFormData((prev) => {
                              const newList = [...list, '']
                              return {
                                ...prev,
                                [field.name]: {
                                  ...(prev[field.name] as LocalizedArray),
                                  [lang]: newList,
                                },
                              }
                            })
                          }
                        >
                          + Add {languageNames[lang]} Item
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name} className="flex">
                  {field.label}
                  <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={
                    formData[field.name] === null
                      ? field.type === 'number'
                        ? undefined
                        : ''
                      : (formData[field.name] as
                          | string
                          | number
                          | readonly string[]
                          | undefined)
                  }
                  onChange={handleInputChange}
                />
              </div>
            )
          )}
        </div>

        <SheetFooter className="mt-6 gap-3">
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-[#372AAC]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
        {toast && (
          <div
            className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border transition-all animate-in slide-in-from-right-5 ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)}>
              <X className="h-4 w-4 opacity-50 hover:opacity-100" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
