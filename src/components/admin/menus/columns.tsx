'use client'

import { ColumnDef } from '@tanstack/react-table'

import { useTranslations } from 'next-intl'
import { DeleteDialog } from '../table/actions/DeleteDialog'
import { EditSheet } from '../table/actions/EditSheet'
export type Menus = {
    id: string
    name: string
    slug: string

    createdAt: string
    updatedAt: string
}

type ActionProps = {
    id: string
}

const Actions = ({ id }: ActionProps) => {
    const t = useTranslations()

    const fields = [
        { name: 'name', label: t('Name'), type: 'localized-text' },
        { name: 'slug', label: t('Path name'), type: 'text' },
    ]

    return (
        <div className="flex space-x-2">
            <EditSheet id={id} route_name="menu" fields={fields} />

            <DeleteDialog id={id} route_name="menu" />
        </div>
    )
}

export const useColumns = (): ColumnDef<Menus>[] => {
    const t = useTranslations()

    return [
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
