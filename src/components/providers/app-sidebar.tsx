'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar'
import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
    Facebook,
    Instagram,
    Mail,
    MessageSquare,
    Phone,
    Send,
    Youtube,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../../public/logo.png'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
}

export function AppSidebar() {
    const t = useTranslations()
    const detailsData = useQuery({
        queryKey: ['details'],
        queryFn: async () => {
            const res = await api.get('/details')
            return res.data
        },
    })
    return (
        <Sidebar className="border-r-0">
            <SidebarHeader className="bg-[#0A0A3D] pt-12 pb-6 px-6 border-b border-white/10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Link href="/" className="flex flex-col items-center gap-2">
                        <div className="relative p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-sm font-bold text-white text-center leading-tight tracking-wide uppercase">
                            Samarqand Viloyati <br />
                            <span className="text-blue-400 font-medium normal-case block mt-1 opacity-80">
                                Investitsiyalar, sanoat va savdo boshqarmasi
                            </span>
                        </h1>
                    </Link>
                </motion.div>
            </SidebarHeader>

            <SidebarContent className="bg-[#0A0A3D] px-4 py-8 overflow-y-auto no-scrollbar">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    <ContactCard
                        icon={<Phone size={18} className="text-blue-400" />}
                        label={t('Ishonch telefoni')}
                        value={detailsData.data?.trustLinePhones || ''}
                    />
                    <ContactCard
                        icon={
                            <MessageSquare
                                size={18}
                                className="text-emerald-400"
                            />
                        }
                        label={t('Devonxona')}
                        value={detailsData.data?.receptionPhone || ''}
                    />
                    <div className="pt-2">
                        <ContactCard
                            icon={<Mail size={18} className="text-amber-400" />}
                            label={t('Korporativ pochta')}
                            value={detailsData.data?.corporateEmails || ''}
                        />
                    </div>
                </motion.div>
            </SidebarContent>

            <SidebarFooter className="bg-[#0A0A3D] pb-10 px-6 border-t border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-[2px] text-center mb-4">
                    {t('Ijtimoiy tarmoqlar')}
                </p>
                <div className="flex justify-center gap-3">
                    <SocialIcon
                        icon={<Send size={18} />}
                        color="hover:bg-sky-500"
                        href="https://t.me/samarqandinvestkompaniyasi"
                    />

                    <SocialIcon
                        icon={<Facebook size={18} />}
                        color="hover:bg-blue-600"
                        href="https://www.facebook.com/share/14QfpykKKVz/"
                    />
                    <SocialIcon
                        icon={<Instagram size={18} />}
                        color="hover:bg-pink-600"
                        href="https://www.instagram.com/saminvestcom?igsh=b25jZGg5MjJkbTF6"
                    />
                    <SocialIcon
                        icon={<Youtube size={18} />}
                        color="hover:bg-red-600"
                        href="https://youtube.com/@samarqandinvestkompaniyasi?si=3vENpZ2DfUkx22yB"
                    />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

function ContactCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string | string[]
}) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className="group flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
        >
            <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div className="pl-8">
                {Array.isArray(value) ? (
                    value.map((v, i) => (
                        <p
                            key={i}
                            className="text-sm text-white font-medium break-all mb-1 last:mb-0"
                        >
                            {v}
                        </p>
                    ))
                ) : (
                    <p className="text-sm text-white font-medium">{value}</p>
                )}
            </div>
        </motion.div>
    )
}

function SocialIcon({
    icon,
    color,
    href,
}: {
    icon: React.ReactNode
    color: string
    href: string
}) {
    return (
        <motion.a
            href={href}
            whileHover={{ y: -4, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-all ${color}`}
        >
            {icon}
        </motion.a>
    )
}
