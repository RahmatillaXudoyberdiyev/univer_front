'use client'

import { AutoForm, FormField } from '@/components/form/auto-form'
import MyTable, { IColumn } from '@/components/my-table'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { api } from '@/models/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Pencil, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

const Slug = () => {
  const t = useTranslations()
  const [open, setOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<string | null>(null)
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
      setEditing(null)
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

      setEditing(null)
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
        title: t('Slug'),
        dataIndex: 'slug',
        key: 'slug',
      },
      // {
      //   title: t('Static'),
      //   dataIndex: 'static',
      //   key: 'static',
      //   render: (s: boolean) =>
      //     !s ? <X color="red" /> : <Check color="green" />,
      // },
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
              onClick={() => setEditing(r.id)}
              variant="ghost"
              size="icon"
            >
              <Pencil color="blue" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash color="red" />
            </Button>
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
        label: t('Slug'),
        name: 'slug',
        type: 'text',
      },
      {
        label: t('Order'),
        name: 'order',
        type: 'number',
      },
    ],
    [t]
  )

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
              {t('Menu qo`shish')}
            </Button>
          </div>
        }
      />

      <Sheet
        open={open || !!editing}
        onOpenChange={() => {
          setOpen(false)
          setEditing(null)
          form.reset({
            nameUz: '',
            nameOz: '',
            nameRu: '',
            nameEn: '',
            slug: '',
            order: 1,
          })
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('Menu qo`shish')}</SheetTitle>
            <SheetDescription className="hidden" />
          </SheetHeader>
          <AutoForm
            fields={fields}
            form={form}
            onSubmit={(values: Record<string, any>) => {
              console.log(values)

              if (editing) {
                updateMenu.mutate({
                  id: editing,
                  data: {
                    name: {
                      uz: values.uz,
                      oz: values.oz,
                      ru: values.ru,
                      en: values.en,
                    } as any,
                    slug: values.slug,
                    order: +values.order,
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
                  order: +values.order,
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
