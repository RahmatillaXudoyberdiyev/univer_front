'use client'

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
import { Asterisk, Edit, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { languageNames } from '@/lib/utils'
import { useEffect, useState } from 'react'

type LocalizedString = { uz: string; ru: string; en: string; oz: string }
type LocalizedArray = { uz: string[]; ru: string[]; en: string[]; oz: string[] }

type EditSheetProps = {
    id: string
    route_name: string
    API_URL: string | undefined
    fields: { name: string; label: string; type: string }[]
}

export const EditSheet = ({
    id,
    route_name,
    API_URL,
    fields,
}: EditSheetProps) => {
    const [data, setData] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        if (isEditing && !data) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${API_URL}/${route_name}/${id}`)
                    if (!res.ok) throw new Error('Failed to fetch')
                    const formData = await res.json()
                    setData(formData)
                } catch (err) {
                    console.error('Failed to fetch data:', err)
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [isEditing, data, id, route_name, API_URL])

    const validate = () => {
        const langs = ['uz', 'oz', 'ru', 'en'] as const
        for (const field of fields) {
            const value = data[field.name]

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
                    const hasValidItem = list.some(
                        (item) => item && item.trim() !== ''
                    )

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

    const handleEdit = async () => {
        if (!validate()) return
        if (!data) return
        try {
            const res = await fetch(`${API_URL}/${route_name}/update/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                window.location.reload()
            } else {
                const errorData = await res.json()
                console.error('Failed to save:', errorData)
                alert(`Save failed: ${errorData.message || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('An error occurred while saving.')
        }
    }

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldKey: string
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                const { filePath } = await res.json()
                setData((prev: any) => ({ ...prev!, [fieldKey]: filePath }))
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            console.error('Upload error:', err)
            alert('Error uploading file')
        }
    }

    const handleListChange = (
        fieldKey: string,
        index: number,
        value: string
    ) => {
        setData((prev: any) => {
            const list = [...(prev?.[fieldKey] || [])]
            list[index] = value
            return { ...prev, [fieldKey]: list }
        })
    }

    const addListItem = (fieldKey: string) => {
        setData((prev: any) => {
            const list = [...(prev?.[fieldKey] || [])]
            list.push('')
            return { ...prev, [fieldKey]: list }
        })
    }

    const removeListItem = (fieldKey: string, index: number) => {
        setData((prev: any) => {
            const list = [...(prev?.[fieldKey] || [])]
            list.splice(index, 1)
            return { ...prev, [fieldKey]: list }
        })
    }

    return (
        <Sheet open={isEditing} onOpenChange={setIsEditing}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log('Edit', id)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto max-h-screen">
                <SheetHeader>
                    <SheetTitle>
                        Edit{' '}
                        {route_name
                            .split('-')
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                    </SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. You can change your
                    </SheetDescription>
                </SheetHeader>
                <div className="px-3">
                    {loading ? (
                        <p className="py-4">Loading...</p>
                    ) : !data ? (
                        <p className="py-4">No data found.</p>
                    ) : (
                        <div className="grid gap-6 pt-4 px-2">
                            {fields.map((field) => {
                                const value = data[field.name]

                                if (field.type === 'file-image') {
                                    return (
                                        <div
                                            className="grid gap-2"
                                            key={field.name}
                                        >
                                            <Label className="flex ">
                                                {' '}
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </Label>
                                            {value ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={`${API_URL}${value}`}
                                                        alt="Current avatar preview"
                                                        className="w-20 h-20 rounded-full object-cover border"
                                                    />
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {value.split('/').pop()}
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
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        field.name
                                                    )
                                                }
                                                className="hidden"
                                                id={`edit-image-upload-${field.name}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            `edit-image-upload-${field.name}`
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                {value
                                                    ? 'Change Image'
                                                    : 'Upload Image'}
                                            </Button>
                                        </div>
                                    )
                                } else if (field.type === 'file') {
                                    return (
                                        <div
                                            className="grid gap-2"
                                            key={field.name}
                                        >
                                            <Label className="flex gap-2">
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3" />
                                            </Label>
                                            {value ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm">
                                                        <a
                                                            href={`${API_URL}${value}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            View/Download File
                                                        </a>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {value.split('/').pop()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    No file uploaded
                                                </p>
                                            )}
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        field.name
                                                    )
                                                }
                                                className="hidden"
                                                id={`edit-file-upload-${field.name}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            `edit-file-upload-${field.name}`
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                {value
                                                    ? 'Change File'
                                                    : 'Upload File'}
                                            </Button>
                                        </div>
                                    )
                                } else if (field.type === 'list') {
                                    const listValue = Array.isArray(value)
                                        ? value
                                        : []
                                    return (
                                        <div
                                            className="grid gap-2"
                                            key={field.name}
                                        >
                                            <Label className="flex">
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3" />
                                            </Label>
                                            <div className="space-y-2">
                                                {listValue.map(
                                                    (
                                                        item: string,
                                                        idx: number
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="flex gap-2"
                                                        >
                                                            <Input
                                                                value={item}
                                                                onChange={(e) =>
                                                                    handleListChange(
                                                                        field.name,
                                                                        idx,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeListItem(
                                                                        field.name,
                                                                        idx
                                                                    )
                                                                }
                                                                className="h-9 w-9"
                                                            >
                                                                <X className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    addListItem(field.name)
                                                }
                                                className="self-start"
                                            >
                                                + Add {field.label}
                                            </Button>
                                        </div>
                                    )
                                } else if (field.type === 'date') {
                                    const dateValue = value
                                        ? new Date(value)
                                              .toISOString()
                                              .split('T')[0]
                                        : ''

                                    return (
                                        <div
                                            className="grid gap-2"
                                            key={field.name}
                                        >
                                            <Label htmlFor={field.name}>
                                                {field.label}
                                            </Label>
                                            <Input
                                                id={field.name}
                                                type="date"
                                                value={dateValue}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    setData((prev: any) => ({
                                                        ...prev!,
                                                        [field.name]: val
                                                            ? new Date(val)
                                                            : null,
                                                    }))
                                                }}
                                            />
                                        </div>
                                    )
                                } else if (field.type === 'markdown') {
                                    return (
                                        <div
                                            className="grid gap-2"
                                            key={field.name}
                                        >
                                            <Label
                                                htmlFor={field.name}
                                                className="flex gap-2"
                                            >
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </Label>
                                            <textarea
                                                id={field.name}
                                                value={data[field.name] ?? ''}
                                                onChange={(e) =>
                                                    setData((prev: any) => ({
                                                        ...prev!,
                                                        [field.name]:
                                                            e.target.value,
                                                    }))
                                                }
                                                rows={8}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                                placeholder={`Enter ${field.label.toLowerCase()} in Markdown...`}
                                            />
                                        </div>
                                    )
                                } else if (field.type === 'checkbox') {
                                    return (
                                        <div
                                            className="flex items-center gap-3 py-2"
                                            key={field.name}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData((prev: any) => ({
                                                        ...prev!,
                                                        [field.name]: !(prev[
                                                            field.name
                                                        ] as boolean),
                                                    }))
                                                }
                                                className={`relative flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                                                    data[field.name]
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {data[field.name] && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-white"
                                                    >
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </button>
                                            <Label className="text-sm font-medium cursor-pointer flex gap-2">
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </Label>
                                        </div>
                                    )
                                } else if (field.type === 'localized-text') {
                                    return (
                                        <div
                                            key={field.name}
                                            className="space-y-3"
                                        >
                                            <div className="flex">
                                                <Label>{field.label}</Label>
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </div>
                                            {(
                                                [
                                                    'uz',
                                                    'oz',
                                                    'ru',
                                                    'en',
                                                ] as const
                                            ).map((lang) => (
                                                <div
                                                    key={lang}
                                                    className="flex items-start gap-5"
                                                >
                                                    <span className="mt-2 text-sm font-medium w-14 text-muted-foreground">
                                                        {languageNames[lang]}
                                                    </span>
                                                    <Input
                                                        value={
                                                            (data[field.name]?.[
                                                                lang
                                                            ] as string) ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                (
                                                                    prev: any
                                                                ) => ({
                                                                    ...prev!,
                                                                    [field.name]:
                                                                        {
                                                                            ...prev[
                                                                                field
                                                                                    .name
                                                                            ],
                                                                            [lang]: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                })
                                                            )
                                                        }
                                                        placeholder={`Enter in ${languageNames[lang]}`}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                } else if (
                                    field.type === 'localized-markdown'
                                ) {
                                    return (
                                        <div
                                            key={field.name}
                                            className="space-y-4"
                                        >
                                            <Label className="flex">
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </Label>
                                            {(
                                                [
                                                    'uz',
                                                    'oz',

                                                    'ru',
                                                    'en',
                                                ] as const
                                            ).map((lang) => (
                                                <div
                                                    key={lang}
                                                    className="border rounded-md p-3"
                                                >
                                                    <div className="text-sm font-medium text-muted-foreground mb-2">
                                                        {languageNames[lang]}
                                                    </div>
                                                    <textarea
                                                        value={
                                                            (data[field.name]?.[
                                                                lang
                                                            ] as string) ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                (
                                                                    prev: any
                                                                ) => ({
                                                                    ...prev!,
                                                                    [field.name]:
                                                                        {
                                                                            ...prev[
                                                                                field
                                                                                    .name
                                                                            ],
                                                                            [lang]: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                })
                                                            )
                                                        }
                                                        rows={6}
                                                        className="w-full font-mono text-sm rounded border px-3 py-2"
                                                        placeholder={`Markdown in ${languageNames[lang]}...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                } else if (field.type === 'localized-list') {
                                    return (
                                        <div
                                            key={field.name}
                                            className="space-y-4"
                                        >
                                            <Label className="flex">
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />

                                                {field.label}
                                            </Label>
                                            {(
                                                [
                                                    'uz',
                                                    'oz',

                                                    'ru',
                                                    'en',
                                                ] as const
                                            ).map((lang) => {
                                                const list =
                                                    (data[field.name]?.[
                                                        lang
                                                    ] as string[]) || []
                                                return (
                                                    <div
                                                        key={lang}
                                                        className="border rounded-md p-3"
                                                    >
                                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                                            {
                                                                languageNames[
                                                                    lang
                                                                ]
                                                            }
                                                        </div>
                                                        <div className="space-y-2">
                                                            {list.map(
                                                                (item, idx) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex gap-2"
                                                                    >
                                                                        <Input
                                                                            value={
                                                                                item
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    (
                                                                                        prev: any
                                                                                    ) => {
                                                                                        const newList =
                                                                                            [
                                                                                                ...list,
                                                                                            ]
                                                                                        newList[
                                                                                            idx
                                                                                        ] =
                                                                                            e.target.value
                                                                                        return {
                                                                                            ...prev!,
                                                                                            [field.name]:
                                                                                                {
                                                                                                    ...prev[
                                                                                                        field
                                                                                                            .name
                                                                                                    ],
                                                                                                    [lang]: newList,
                                                                                                },
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder={`Item ${
                                                                                idx +
                                                                                1
                                                                            }`}
                                                                            className="flex-1"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                setData(
                                                                                    (
                                                                                        prev: any
                                                                                    ) => {
                                                                                        const newList =
                                                                                            list.filter(
                                                                                                (
                                                                                                    _,
                                                                                                    i
                                                                                                ) =>
                                                                                                    i !==
                                                                                                    idx
                                                                                            )
                                                                                        return {
                                                                                            ...prev!,
                                                                                            [field.name]:
                                                                                                {
                                                                                                    ...prev[
                                                                                                        field
                                                                                                            .name
                                                                                                    ],
                                                                                                    [lang]: newList,
                                                                                                },
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="h-9 w-9"
                                                                        >
                                                                            <X className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setData(
                                                                        (
                                                                            prev: any
                                                                        ) => {
                                                                            const newList =
                                                                                [
                                                                                    ...list,
                                                                                    '',
                                                                                ]
                                                                            return {
                                                                                ...prev!,
                                                                                [field.name]:
                                                                                    {
                                                                                        ...prev[
                                                                                            field
                                                                                                .name
                                                                                        ],
                                                                                        [lang]: newList,
                                                                                    },
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                                className="self-start"
                                                            >
                                                                + Add{' '}
                                                                {
                                                                    languageNames[
                                                                        lang
                                                                    ]
                                                                }{' '}
                                                                Item
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                } else if (field.type === 'localized-list') {
                                    return (
                                        <div
                                            key={field.name}
                                            className="space-y-4"
                                        >
                                            <Label className="flex">
                                                {field.label}
                                                <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                            </Label>
                                            {(
                                                [
                                                    'uz',
                                                    'oz',
                                                    'ru',
                                                    'en',
                                                ] as const
                                            ).map((lang) => {
                                                const list =
                                                    (data[field.name]?.[
                                                        lang
                                                    ] as string[]) || []
                                                return (
                                                    <div
                                                        key={lang}
                                                        className="border rounded-md p-3"
                                                    >
                                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                                            {
                                                                languageNames[
                                                                    lang
                                                                ]
                                                            }
                                                        </div>
                                                        <div className="space-y-2">
                                                            {list.map(
                                                                (item, idx) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex gap-2"
                                                                    >
                                                                        <Input
                                                                            value={
                                                                                item
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    (
                                                                                        prev: any
                                                                                    ) => {
                                                                                        const newList =
                                                                                            [
                                                                                                ...list,
                                                                                            ]
                                                                                        newList[
                                                                                            idx
                                                                                        ] =
                                                                                            e.target.value
                                                                                        return {
                                                                                            ...prev!,
                                                                                            [field.name]:
                                                                                                {
                                                                                                    ...prev[
                                                                                                        field
                                                                                                            .name
                                                                                                    ],
                                                                                                    [lang]: newList,
                                                                                                },
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder={`Item ${
                                                                                idx +
                                                                                1
                                                                            }`}
                                                                            className="flex-1"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                setData(
                                                                                    (
                                                                                        prev: any
                                                                                    ) => {
                                                                                        const newList =
                                                                                            list.filter(
                                                                                                (
                                                                                                    _,
                                                                                                    i
                                                                                                ) =>
                                                                                                    i !==
                                                                                                    idx
                                                                                            )
                                                                                        return {
                                                                                            ...prev!,
                                                                                            [field.name]:
                                                                                                {
                                                                                                    ...prev[
                                                                                                        field
                                                                                                            .name
                                                                                                    ],
                                                                                                    [lang]: newList,
                                                                                                },
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="h-9 w-9"
                                                                        >
                                                                            <X className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setData(
                                                                        (
                                                                            prev: any
                                                                        ) => {
                                                                            const newList =
                                                                                [
                                                                                    ...list,
                                                                                    '',
                                                                                ]
                                                                            return {
                                                                                ...prev!,
                                                                                [field.name]:
                                                                                    {
                                                                                        ...prev[
                                                                                            field
                                                                                                .name
                                                                                        ],
                                                                                        [lang]: newList,
                                                                                    },
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                                className="self-start"
                                                            >
                                                                + Add{' '}
                                                                {
                                                                    languageNames[
                                                                        lang
                                                                    ]
                                                                }{' '}
                                                                Item
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        className="grid gap-2"
                                        key={field.name}
                                    >
                                        <Label
                                            htmlFor={field.name}
                                            className="flex"
                                        >
                                            {field.label}
                                            <Asterisk className="text-red-600 w-3 h-3 mb-3" />
                                        </Label>
                                        <Input
                                            id={field.name}
                                            type={
                                                field.type === 'number'
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            value={value ?? ''}
                                            onChange={(e) =>
                                                setData((prev: any) => ({
                                                    ...prev!,
                                                    [field.name]:
                                                        field.type === 'number'
                                                            ? Number(
                                                                  e.target.value
                                                              )
                                                            : e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <SheetFooter className="gap-3">
                    <Button onClick={handleEdit} className="bg-[#372AAC]">
                        Save changes
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
                {toast && (
                    <div
                        className={`fixed top-5 right-5 z-100 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border transition-all animate-in slide-in-from-right-5 ${
                            toast.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <span className="text-sm font-medium">
                            {toast.message}
                        </span>
                        <button onClick={() => setToast(null)}>
                            <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
