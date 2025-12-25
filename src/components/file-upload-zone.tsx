'use client'

import { api, baseBackendUrl } from '@/models/axios' // sizning axios instance'ingiz
import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react'
import Link from 'next/link'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export interface UploadedFile {
  file: File
  preview?: string
  uploadedUrl?: string
  uploading: boolean
  error?: string
}

const FileUploadZone = ({
  files,
  setFiles,
}: {
  files: UploadedFile[]
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
}) => {
  // Fayl turiga qarab ikonka qaytarish
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/'))
      return <FileImage className="w-10 h-10 text-blue-500" />
    if (type.startsWith('video/'))
      return <FileVideo className="w-10 h-10 text-purple-500" />
    if (type.startsWith('audio/'))
      return <FileAudio className="w-10 h-10 text-green-500" />
    if (type === 'application/pdf')
      return <FileText className="w-10 h-10 text-red-500" />
    if (type.includes('zip') || type.includes('rar'))
      return <FileArchive className="w-10 h-10 text-yellow-600" />
    if (
      type.includes('javascript') ||
      type.includes('json') ||
      type.includes('html')
    )
      return <FileCode className="w-10 h-10 text-indigo-500" />
    return <File className="w-10 h-10 text-gray-500" />
  }

  // Fayllarni yuklash funksiyasi (bulk upload)
  const uploadFiles = async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
      uploading: true,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Har bir faylni alohida yuklaymiz (parallel)
    const uploadPromises = acceptedFiles.map(async (file, index) => {
      const formData = new FormData()
      formData.append('files', file) // backend FilesInterceptor('files')

      try {
        const response = await api.post('/uploads/bulk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        // Javobda bir nechta fayl bo'lishi mumkin, lekin biz bitta yuborganmiz
        const uploaded = response.data.files?.find(
          (f: any) => f.originalName === file.name
        )

        console.log(uploaded)

        setFiles((prev) =>
          prev.map((f, i) =>
            i === prev.length - acceptedFiles.length + index
              ? {
                  ...f,
                  uploading: false,
                  uploadedUrl:
                    `${baseBackendUrl}${uploaded?.url}` ||
                    `${baseBackendUrl}/uploads/${uploaded?.path}`,
                }
              : f
          )
        )
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === prev.length - acceptedFiles.length + index
              ? { ...f, uploading: false, error: 'Yuklashda xato' }
              : f
          )
        )
      }
    })

    await Promise.all(uploadPromises)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // multiple: true - default true
    // maxSize: 50 * 1024 * 1024, // 50MB - ixtiyoriy
  })

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)
      // Preview URL ni tozalash (memory leak oldini olish)
      if (prev[index].preview) URL.revokeObjectURL(prev[index].preview)
      return newFiles
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-xl font-medium text-gray-700">
          {isDragActive
            ? 'Fayllarni bu yerga tashlang'
            : 'Fayllarni sudrab keling yoki bosing'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Bir vaqtning o‘zida bir nechta fayl yuklashingiz mumkin
        </p>
      </div>

      {/* Yuklangan fayllar ro‘yxati */}
      {files?.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Yuklangan fayllar
          </h3>
          {files?.map((fileObj, index) => {
            console.log(fileObj)

            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Ikonka yoki preview */}
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg">
                      {getFileIcon(fileObj.file.type)}
                    </div>
                  )}
                </div>

                {/* Fayl ma'lumotlari */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB •{' '}
                    {fileObj.file.type || 'Noma’lum'}
                  </p>
                  {fileObj.uploadedUrl && (
                    <Link
                      href={`${baseBackendUrl}/${fileObj.uploadedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Havolani ochish
                    </Link>
                  )}
                </div>

                {/* Status va o'chirish */}
                <div className="flex items-center gap-3">
                  {fileObj.uploading && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  )}
                  {fileObj.error && (
                    <span className="text-sm text-red-600">
                      {fileObj.error}
                    </span>
                  )}
                  {fileObj.uploadedUrl && (
                    <span className="text-sm text-green-600">✓ Yuklandi</span>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FileUploadZone
