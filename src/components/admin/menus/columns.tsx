'use client'

import { ColumnDef } from '@tanstack/react-table'

import { useTranslations } from 'next-intl'
import { DeleteDialog } from '../table/actions/DeleteDialog'
import { EditSheet } from '../table/actions/EditSheet'
export type Menus = {
    id: string
    name: string
    slug: string
    order: number
    static: boolean
    createdAt: string
    updatedAt: string
}

type ActionProps = {
    id: string
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const Actions = ({ id }: ActionProps) => {
    const t = useTranslations()

    const fields = [
        { name: 'name', label: t('Name'), type: 'localized-text' },
        { name: 'slug', label: t('Path name'), type: 'text' },
        { name: 'order', label: t('Order'), type: 'number' },
    ]

    return (
        <div className="flex space-x-2">
            <EditSheet
                id={id}
                route_name="menu"
                API_URL={API_URL}
                fields={fields}
            />

            <DeleteDialog id={id} route_name="menu" API_URL={API_URL} />
        </div>
    )
}

export const useColumns = (): ColumnDef<Menus>[] => {
    const t = useTranslations()

    return [
        {
            accessorKey: 'order',
            header: t('Order'),
            cell: ({ row }) => {
                const order = row.original.order
                return <div className="text-center">{order}</div>
            },
        },
        {
            accessorKey: 'name',
            header: t('Name'),
            cell: ({ row }) => {
                let nameUz = '',
                    nameRu = '',
                    nameEn = '',
                    nameOz = ''
                const raw = row.original.name

                if (typeof raw === 'string') {
                    nameUz = raw
                    nameRu = raw
                    nameEn = raw
                    nameOz = raw
                } else if (raw && typeof raw === 'object') {
                    nameUz = (raw as any).uz || ''
                    nameRu = (raw as any).ru || ''
                    nameEn = (raw as any).en || ''
                    nameOz = (raw as any).oz || ''
                }

                return (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">
                            O'zbekcha:
                        </span>
                        <span>{nameUz || '—'}</span>
                        <span></span>
                        <span className="font-medium text-muted-foreground">
                            Русский:
                        </span>
                        <span>{nameRu || '—'}</span>
                        <span></span>
                        <span className="font-medium text-muted-foreground">
                            English:
                        </span>
                        <span>{nameEn || '—'}</span>
                        <span></span>
                        <span className="font-medium text-muted-foreground">
                            О'збекча:
                        </span>
                        <span>{nameOz || '—'}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'slug',
            header: t('Path name'),
            cell: ({ row }) => {
                const slug = row.original.slug
                return slug
            },
        },
        {
            accessorKey: 'static',
            header: t('Static'),
            cell: ({ row }) => {
                const isStatic = row.original.static
                return (
                    <div className="flex items-center">
                        <div
                            className={`relative flex h-5 w-5 items-center justify-center rounded-sm border ${
                                isStatic
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            {isStatic && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">
                            {isStatic ? t('Yes') : t('No')}
                        </span>
                    </div>
                )
            },
            enableSorting: true,
        },
        {
            accessorKey: 'createdAt',
            header: t('Created Date'),
            cell: ({ row }) => {
                const createdAt = row.original.createdAt
                return new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })
            },
        },
        {
            accessorKey: 'updatedAt',
            header: t('Updated Date'),
            cell: ({ row }) => {
                const updatedAt = row.original.updatedAt
                return new Date(updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })
            },
        },
        {
            id: 'actions',
            accessorKey: 'Actions',
            cell: ({ row }) => {
                const menu = row.original
                return <Actions id={menu.id} />
            },
            enableSorting: false,
            enableHiding: false,
        },
    ]
}
