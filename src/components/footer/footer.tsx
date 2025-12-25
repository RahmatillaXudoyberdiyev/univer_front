'use client'

import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Youtube,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../public/logo.png'

const Footer = () => {
    const locale = useLocale()
    const t = useTranslations()
    const detailsData = useQuery({
        queryKey: ['details'],
        queryFn: async () => {
            const res = await api.get('/details')
            return res.data
        },
    })
    return (
        <footer className="bg-[#0A0A3D] py-12 text-white">
            <div className="container-cs px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="flex flex-col items-center md:items-start gap-6">
                        <div className="relative ">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={90}
                                height={90}
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-lg font-bold text-center md:text-left leading-tight tracking-wide uppercase">
                                Samarqand <br />
                                <span className="text-blue-400 font-medium normal-case block mt-1">
                                    Invest kompaniyasi
                                </span>
                            </h1>
                        </div>
                        <p className=" text-white/70 text-center md:text-left max-w-lg leading-relaxed">
                            {t('footer-desc')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold">{t('Aloqa')}</h2>

                        <div className="space-y-5 text-white/90">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-4">
                                    {detailsData.data?.trustLinePhones &&
                                        detailsData.data?.trustLinePhones.map(
                                            (phone: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-4"
                                                >
                                                    <Phone
                                                        size={22}
                                                        className="text-blue-400"
                                                    />
                                                    <Link
                                                        href={`tel:+${phone.replace(
                                                            /\D/g,
                                                            ''
                                                        )}`}
                                                        className="text-base hover:text-blue-400 transition-colors"
                                                    >
                                                        {phone}
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Mail size={22} className="text-blue-400" />
                                <a
                                    href="mailto:info@saminvest.uz"
                                    className="text-base hover:text-blue-400 transition-colors"
                                >
                                    {detailsData.data?.infoEmails}
                                </a>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin
                                    size={22}
                                    className="text-blue-400 shrink-0"
                                />
                                <p className="text-base leading-relaxed">
                                    Samarqand shahri, Ko‘ksaroy maydoni, 1-uy
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">
                                {t('Ish vaqti')}:
                            </h3>
                            <p className="text-base text-white/80">
                                {detailsData.data?.workingHours[locale]}
                            </p>
                        </div>

                        <div className="pt-4">
                            <p className="text-[10px] text-white/40 uppercase tracking-[2px] mb-4">
                                {t('Ijtimoiy tarmoqlar')}
                            </p>
                            <div className="flex justify-start gap-3">
                                <SocialIcon
                                    icon={<Send size={18} />}
                                    color="hover:bg-sky-500"
                                    href="#"
                                />
                                <SocialIcon
                                    icon={<Facebook size={18} />}
                                    color="hover:bg-blue-600"
                                    href="#"
                                />
                                <SocialIcon
                                    icon={<Instagram size={18} />}
                                    color="hover:bg-pink-600"
                                    href="#"
                                />
                                <SocialIcon
                                    icon={<Youtube size={18} />}
                                    color="hover:bg-red-600"
                                    href="#"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

type SocialIconType = {
    icon: React.ReactNode
    color: string
    href: string
}

const SocialIcon = ({ icon, color, href }: SocialIconType) => (
    <a
        href={href}
        className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${color} hover:border-transparent hover:scale-110`}
    >
        {icon}
    </a>
)

export default Footer
