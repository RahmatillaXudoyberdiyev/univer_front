'use client'

import { AutoForm, FormField } from '@/components/form/auto-form'
import MyTable, { IColumn } from '@/components/my-table'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { api } from '@/models/axios'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

const Slug = () => {
    const t = useTranslations()
    const [open, setOpen] = useState<boolean>(false)
    const [editingItem, setEditingItem] = useState<{
        id: string
        slug: string
    } | null>(null)
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const form = useForm()
    const { slug } = useParams()
    const data = useQuery({
        queryKey: ['submenus', slug],
        queryFn: async () => {
            const res = await api.get(`/sub-menu/${slug}`)
            return res.data
        },
    })

    const subMenu = useQuery({
        enabled: !!editingItem,
        queryKey: ['subMenu', editingItem?.slug],
        queryFn: async () => {
            const res = await api.get(`/sub-menu/slug/${editingItem!.slug}`)
            return res.data
        },
    })

    const createMenu = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const res = await api.post('/sub-menu/create', data)
            return res.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['submenus'],
            })
            setOpen(false)
            setEditingItem(null)
            form.reset({
                nameUz: '',
                nameOz: '',
                nameRu: '',
                nameEn: '',
                slug: '',
            })
        },
    })

    const updateMenu = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string
            data: Record<string, any>
        }) => {
            const res = await api.patch(`/sub-menu/update/${id}`, data)
            return res.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['submenus'],
            })
            setOpen(false)
            setEditingItem(null)
            form.reset({
                nameUz: '',
                nameOz: '',
                nameRu: '',
                nameEn: '',
                slug: '',
            })
        },
    })

    const deleteMenu = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/sub-menu/delete/${id}`)
            console.log(id, 'asdasdasdsadasdasdasd bu id')
            return res.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['submenus'],
            })
            setOpen(false)
            setEditingItem(null)
            form.reset({
                nameUz: '',
                nameOz: '',
                nameRu: '',
                nameEn: '',
                slug: '',
            })
        },
    })

    const columns = useMemo<IColumn[]>(
        () => [
            {
                title: t('Name UZ'),
                dataIndex: ['name', 'uz'],
                key: 'nameUz',
            },
            {
                title: t('Name OZ'),
                dataIndex: ['name', 'oz'],
                key: 'nameOz',
            },
            {
                title: t('Name RU'),
                dataIndex: ['name', 'ru'],
                key: 'nameRu',
            },
            {
                title: t('Name EN'),
                dataIndex: ['name', 'en'],
                key: 'nameEn',
            },
            {
                title: t('Path name'),
                dataIndex: 'slug',
                key: 'slug',
            },

            {
                title: t('Actions'),
                dataIndex: 'slug',
                key: 'action',
                render: (value, r: Record<string, any>) => (
                    <div className="flex gap-2">
                        <Link href={`${pathname}/${value}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowRight color="green" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                setEditingItem({ id: r.id, slug: r.slug })
                            }
                            variant="ghost"
                            size="icon"
                        >
                            <Pencil color="blue" />
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size={'icon'}
                                    variant="destructive"
                                    className="z-50 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 />
                                </Button>
                            </DialogTrigger>
                            <DialogContent onClick={(e) => e.stopPropagation()}>
                                <DialogTitle className='hidden'></DialogTitle>
                                <p className="mb-4">
                                    Rostdan o‘chirmoqchimisiz?
                                </p>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                deleteMenu.mutate(r.id)
                                            }}
                                        >
                                            Ha, o‘chirish
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Bekor qilish
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ),
            },
        ],
        [t]
    )

    const fields = useMemo<FormField[]>(
        () => [
            {
                label: t('Name UZ'),
                name: 'uz',
                type: 'text',
            },
            {
                label: t('Name OZ'),
                name: 'oz',
                type: 'text',
            },
            {
                label: t('Name RU'),
                name: 'ru',
                type: 'text',
            },
            {
                label: t('Name EN'),
                name: 'en',
                type: 'text',
            },
            {
                label: t('Path name'),
                name: 'slug',
                type: 'text',
            },
        ],
        [t]
    )

    useEffect(() => {
        if (editingItem && subMenu.data) {
            form.reset({
                uz: subMenu.data.name?.uz ?? '',
                oz: subMenu.data.name?.oz ?? '',
                ru: subMenu.data.name?.ru ?? '',
                en: subMenu.data.name?.en ?? '',
                slug: subMenu.data.slug ?? '',
            })
        }
    }, [editingItem, subMenu.data])

    return (
        <div className="p-4">
            <MyTable
                columns={columns}
                dataSource={data.data}
                rangepickerFilter={false}
                exportExcel={false}
                showIndexColumn
                showDataCount={false}
                isLoading={data.isLoading}
                header={
                    <div>
                        <Button size={'sm'} onClick={() => setOpen(true)}>
                            {t('Menu qoshish')}
                        </Button>
                    </div>
                }
            />

            <Sheet
                open={open || !!editingItem}
                onOpenChange={() => {
                    setOpen(false)
                    setEditingItem(null)
                    form.reset({
                        nameUz: '',
                        nameOz: '',
                        nameRu: '',
                        nameEn: '',
                        slug: '',
                    })
                }}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{t('Menu qoshish')}</SheetTitle>
                        <SheetDescription className="hidden" />
                    </SheetHeader>
                    <AutoForm
                        fields={fields}
                        form={form}
                        onSubmit={(values: Record<string, any>) => {
                            if (editingItem) {
                                updateMenu.mutate({
                                    id: editingItem.id,
                                    data: {
                                        name: {
                                            uz: values.uz,
                                            oz: values.oz,
                                            ru: values.ru,
                                            en: values.en,
                                        } as any,
                                        slug: values.slug,
                                    } as any,
                                })
                            } else {
                                createMenu.mutate({
                                    name: {
                                        uz: values.uz,
                                        oz: values.oz,
                                        ru: values.ru,
                                        en: values.en,
                                    },
                                    slug: values.slug,
                                    menu: { connect: { slug: slug } },
                                })
                            }
                        }}
                    />
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Slug
