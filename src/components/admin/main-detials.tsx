'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useNotify from '@/hooks/use-notify'
import { api } from '@/models/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Asterisk, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

/* -------------------- CONSTANTS -------------------- */

const LANGUAGES = [
  { key: 'uz', label: "O'zbekcha" },
  { key: 'oz', label: 'Ўзбекча' },
  { key: 'ru', label: 'Русский' },
  { key: 'en', label: 'English' },
] as const

/* -------------------- SCHEMA -------------------- */

const formSchema = z.object({
  receptionPhone: z
    .string()
    .min(1, 'Reception phone majburiy')
    .regex(/^\+?\d+$/, 'Telefon raqam noto‘g‘ri'),

  infoEmails: z.string().min(1, 'Email majburiy'),

  trustLinePhones: z
    .array(z.string().min(1, 'Telefon bo‘sh bo‘lmasin'))
    .min(1, 'Kamida bitta telefon bo‘lishi kerak'),

  corporateEmails: z
    .array(z.string().min(1, 'Email bo‘sh bo‘lmasin'))
    .min(1, 'Kamida bitta email bo‘lishi kerak'),

  workingHours: z.object({
    uz: z.string().min(1, 'UZ majburiy'),
    oz: z.string().min(1, 'OZ majburiy'),
    ru: z.string().min(1, 'RU majburiy'),
    en: z.string().min(1, 'EN majburiy'),
  }),
})

type FormValues = z.infer<typeof formSchema>

const MainDetails = () => {
  const { toastSuccess, toastError } = useNotify()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receptionPhone: '',
      infoEmails: '',
      trustLinePhones: [''],
      corporateEmails: [''],
      workingHours: { uz: '', oz: '', ru: '', en: '' },
    },
  })

  const { errors, isSubmitting } = form.formState

  const trustLineArray = useFieldArray({
    control: form.control,
    name: 'trustLinePhones',
  })

  const corporateEmailsArray = useFieldArray({
    control: form.control,
    name: 'corporateEmails',
  })

  /* -------------------- API -------------------- */

  const details = useQuery({
    queryKey: ['details'],
    queryFn: async () => {
      const res = await api.get<FormValues>('/details')
      return res.data
    },
  })

  const updateDetails = useMutation({
    mutationFn: async (data: FormValues) => {
      return api.patch('/details', data)
    },
    onSuccess: () => {
      toastSuccess('Details updated successfully')
      details.refetch()
    },
  })

  useEffect(() => {
    if (details.data) {
      form.reset(details.data)
    }
  }, [details.data, form])

  /* -------------------- SUBMIT -------------------- */

  const onSubmit = (data: FormValues) => {
    updateDetails.mutate(data)
  }

  const onError = (errs: typeof errors) => {
    const firstError =
      errs.receptionPhone?.message ||
      errs.infoEmails?.message ||
      errs.trustLinePhones?.[0]?.message ||
      errs.corporateEmails?.[0]?.message ||
      errs.workingHours?.uz?.message

    if (firstError) {
      toastError(firstError as string)
    }
  }

  if (details.isLoading || !details.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#372AAC]" />
      </div>
    )
  }

  /* -------------------- UI -------------------- */

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="container-cs py-10 space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage contact details and working schedule.
          </p>
        </div>
        <Button
          type="submit"
          disabled={updateDetails.isPending || isSubmitting}
          className="bg-[#372AAC] px-10 h-11 text-white"
        >
          {updateDetails.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Update Details
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* CONTACT */}
        <Card className="row-span-2">
          <CardHeader>
            <CardTitle>Contact Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>
                Reception Phone{' '}
                <Asterisk className="inline w-3 h-3 text-red-500" />
              </Label>
              <Input {...form.register('receptionPhone')} />
              {errors.receptionPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.receptionPhone.message}
                </p>
              )}
            </div>

            <div>
              <Label>
                Info Email <Asterisk className="inline w-3 h-3 text-red-500" />
              </Label>
              <Input {...form.register('infoEmails')} />
              {errors.infoEmails && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.infoEmails.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* TRUST LINE */}
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Trust Line Phones</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={() => trustLineArray.append('')}
            >
              <Plus /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {trustLineArray.fields.map((field, idx) => (
              <div key={field.id}>
                <div className="flex gap-2">
                  <Input {...form.register(`trustLinePhones.${idx}`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => trustLineArray.remove(idx)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
                {errors.trustLinePhones?.[idx] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.trustLinePhones[idx]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CORPORATE EMAILS */}
        <Card className="col-span-1">
          <CardHeader className="flex justify-between">
            <CardTitle>Corporate Emails</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={() => corporateEmailsArray.append('')}
            >
              <Plus /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {corporateEmailsArray.fields.map((field, idx) => (
              <div key={field.id}>
                <div className="flex gap-2">
                  <Input {...form.register(`corporateEmails.${idx}`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => corporateEmailsArray.remove(idx)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
                {errors.corporateEmails?.[idx] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.corporateEmails[idx]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* WORKING HOURS */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>All languages are required</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="uz">
              <TabsList>
                {LANGUAGES.map((l) => (
                  <TabsTrigger key={l.key} value={l.key}>
                    {l.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LANGUAGES.map((l) => (
                <TabsContent key={l.key} value={l.key}>
                  <Input {...form.register(`workingHours.${l.key}`)} />
                  {errors.workingHours?.[l.key] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.workingHours[l.key]?.message}
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default MainDetails
