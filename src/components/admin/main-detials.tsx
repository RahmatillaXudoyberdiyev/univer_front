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
import { Asterisk, Loader2, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const LANGUAGES = [
    { key: 'uz', label: "O'zbekcha" },
    { key: 'oz', label: 'Ўзбекча' },
    { key: 'ru', label: 'Русский' },
    { key: 'en', label: 'English' },
]

interface MainSettings {
    receptionPhone: string
    infoEmails: string
    trustLinePhones: string[]
    corporateEmails: string[]
    workingHours: Record<string, string>
}

const MainDetails = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{
        message: string
        type: 'success' | 'error'
    } | null>(null)

    const [data, setData] = useState<MainSettings>({
        receptionPhone: '',
        infoEmails: '',
        trustLinePhones: [''],
        corporateEmails: [''],
        workingHours: { uz: '', oz: '', ru: '', en: '' },
    })

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/details`)
            const result = await res.json()
            if (result) {
                setData({
                    receptionPhone: result.receptionPhone || '',
                    infoEmails: result.infoEmails || result.infoEmail || '', // Handle migration if key changed
                    trustLinePhones: result.trustLinePhones?.length
                        ? result.trustLinePhones
                        : [''],
                    corporateEmails: result.corporateEmails?.length
                        ? result.corporateEmails
                        : [''],
                    workingHours: result.workingHours || {
                        uz: '',
                        oz: '',
                        ru: '',
                        en: '',
                    },
                })
            }
        } catch (error) {
            showToast('Failed to load data from server', 'error')
        } finally {
            setLoading(false)
        }
    }

    const validate = () => {
        const hasTrustLine = data.trustLinePhones.some((p) => p.trim() !== '')
        const hasCorpEmail = data.corporateEmails.some((e) => e.trim() !== '')

        if (!hasTrustLine) {
            showToast('At least one Trust Line Phone is required', 'error')
            return false
        }
        if (!hasCorpEmail) {
            showToast('At least one Corporate Email is required', 'error')
            return false
        }
        return true
    }

    const handleSave = async () => {
        if (!validate()) return

        setSaving(true)
        try {
            const response = await fetch(`${API_URL}/details`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                showToast('Settings updated successfully!', 'success')
            } else {
                throw new Error()
            }
        } catch (error) {
            showToast('Failed to save changes', 'error')
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const updateArrayField = (
        field: 'trustLinePhones' | 'corporateEmails',
        index: number,
        value: string
    ) => {
        const updated = [...data[field]]
        updated[index] = value
        setData({ ...data, [field]: updated })
    }

    const addArrayField = (field: 'trustLinePhones' | 'corporateEmails') => {
        setData({ ...data, [field]: [...data[field], ''] })
    }

    const removeArrayField = (
        field: 'trustLinePhones' | 'corporateEmails',
        index: number
    ) => {
        const updated = data[field].filter((_, i) => i !== index)
        setData({ ...data, [field]: updated.length ? updated : [''] })
    }

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-[#372AAC] h-8 w-8" />
            </div>
        )

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 relative ">
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-100 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border transition-all animate-in slide-in-from-right-5 ${
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

            <div className="flex justify-between items-end border-b pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight ">
                        General Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage contact details and working schedule.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#372AAC] hover:bg-[#2d228d] text-white px-10 h-11"
                >
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Update Details
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card className="shadow-sm border-slate-200 dark:bg-[#232351]">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Contact Channels
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="reception">
                                    Reception Phone
                                </Label>
                                <Asterisk className="text-red-600 w-3 h-3" />
                            </div>
                            <Input
                                id="reception"
                                value={data.receptionPhone}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        receptionPhone: e.target.value,
                                    })
                                }
                                placeholder="+998 -- --- -- --"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="infoEmails">
                                    General Info Emails
                                </Label>
                                <Asterisk className="text-red-600 w-3 h-3" />
                            </div>
                            <Input
                                id="infoEmails"
                                value={data.infoEmails}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        infoEmails: e.target.value,
                                    })
                                }
                                placeholder="info@organization.uz"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="shadow-sm border-slate-200 dark:bg-[#232351]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-1">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Trust Line Phones
                                </CardTitle>
                                <Asterisk className="text-red-600 w-3 h-3" />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addArrayField('trustLinePhones')}
                                className="h-8 text-[#372AAC] dark:text-white font-bold"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {data.trustLinePhones.map((phone, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={phone}
                                        onChange={(e) =>
                                            updateArrayField(
                                                'trustLinePhones',
                                                idx,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter phone number"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeArrayField(
                                                'trustLinePhones',
                                                idx
                                            )
                                        }
                                        className="hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 dark:bg-[#232351]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-1">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Corporate Emails
                                </CardTitle>
                                <Asterisk className="text-red-600 w-3 h-3" />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addArrayField('corporateEmails')}
                                className="h-8 text-[#372AAC] dark:text-white font-bold"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {data.corporateEmails.map((email, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={email}
                                        onChange={(e) =>
                                            updateArrayField(
                                                'corporateEmails',
                                                idx,
                                                e.target.value
                                            )
                                        }
                                        placeholder="email@company.uz"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeArrayField(
                                                'corporateEmails',
                                                idx
                                            )
                                        }
                                        className="hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200 dark:bg-[#232351]">
                <CardHeader>
                    <div className="flex items-center gap-1">
                        <CardTitle className="text-lg">Working Hours</CardTitle>
                        <Asterisk className="text-red-600 w-3 h-3" />
                    </div>
                    <CardDescription>
                        Specify the working schedule for all supported
                        languages.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="uz" className="w-full">
                        <TabsList className="bg-slate-100 dark:bg-[#212149] p-1 mb-4">
                            {LANGUAGES.map((lang) => (
                                <TabsTrigger
                                    key={lang.key}
                                    value={lang.key}
                                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    {lang.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {LANGUAGES.map((lang) => (
                            <TabsContent key={lang.key} value={lang.key}>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Misol uchun: Dushanba - Juma: 09:00 - 18:00"
                                        value={
                                            data.workingHours[lang.key] || ''
                                        }
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                workingHours: {
                                                    ...data.workingHours,
                                                    [lang.key]: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default MainDetails
