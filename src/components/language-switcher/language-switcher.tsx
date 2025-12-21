'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Cookies from 'js-cookie'
import { GlobeIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const locales = [
    { label: "O'zbekcha", value: 'uz', flag: '🇺🇿' },
    { label: 'Ўзбекча', value: 'oz', flag: '🇺🇿' },
    { label: 'English', value: 'en', flag: '🇺🇸' },
    { label: 'Русский', value: 'ru', flag: '🇷🇺' },
]

export function LanguageSwitcher() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const handleChange = (locale: string) => {
        Cookies.set('intl-locale', locale, { path: '/', sameSite: 'Lax' })
        document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
        localStorage.setItem('locale', locale)

        const currentLocale = pathname.split('/')[1]
        const newPath = pathname.replace(
            new RegExp(`^/${currentLocale}`),
            `/${locale}`
        )

        router.push(newPath)
        router.refresh()
        setOpen(false)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                    <GlobeIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-[#0A0A3D] z-80">
                {locales.map((lang) => (
                    <DropdownMenuItem
                        key={lang.value}
                        onClick={() => handleChange(lang.value)}
                        className="cursor-pointer dark:hover:bg-[#372AAC]"
                    >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
