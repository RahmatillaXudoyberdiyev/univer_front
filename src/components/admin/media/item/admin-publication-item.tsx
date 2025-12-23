'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ChevronLeft, Clock, Printer } from 'lucide-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'

const AdminPublicationItem = ({ id, tab }: { id: string; tab: string }) => {
    const locale = useLocale()
    const t = useTranslations()
    const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1248'
    const [activeMedia, setActiveMedia] = useState<string | null>(null)

    const { data: post, isLoading } = useQuery({
        queryKey: ['publication', id],
        queryFn: async () => {
            const response = await api.get(`/publication/${id}`)
            return response.data
        },
        enabled: !!id,
    })

    const { data: latestNews } = useQuery({
        queryKey: ['latest-news'],
        queryFn: async () => {
            const response = await api.get('/publication')
            return Array.isArray(response.data)
                ? response.data.filter((i: any) => i.id !== id).slice(0, 3)
                : []
        },
    })

    useEffect(() => {
        if (post?.url?.length > 0) {
            setActiveMedia(post.url[0])
        }
    }, [post])

    const getLocalizedValue = (obj: any) => {
        if (!obj) return ''
        return (
            obj[locale] || obj['uz'] || obj['en'] || Object.values(obj)[0] || ''
        )
    }

    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
        return videoExtensions.some((ext) => url?.toLowerCase().endsWith(ext))
    }

    if (isLoading) {
        return (
            <div className="container-cs py-10 space-y-8 animate-pulse">
                <div className="h-8 w-24 bg-muted rounded-lg" />
                <div className="h-12 w-full bg-muted rounded-xl" />
                <div className="aspect-21/9 w-full bg-muted rounded-[2.5rem]" />
            </div>
        )
    }

    if (!post)
        return (
            <div className="text-center py-20 font-medium text-muted-foreground">
                {t("Malumot topilmadi")}
            </div>
        )

    const title = getLocalizedValue(post.title)
    const content = getLocalizedValue(post.content)
    const fullDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
          })
        : '---'
    const time = post.createdAt
        ? new Date(post.createdAt).toLocaleTimeString(locale, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: false,
          })
        : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-cs py-10 md:py-20"
        >
            <div className="flex items-center justify-between mb-12">
                <Link href="/admin/media">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent rounded-full pl-2 pr-5 group transition-colors"
                    >
                        <ChevronLeft className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        {t("Orqaga")}
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.print()}
                    className="rounded-full border-muted-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                    <Printer className="h-4.5 w-4.5" />
                </Button>
            </div>

            <div className="max-w-4xl mb-12">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest">
                        {post.type || tab}
                    </div>
                    <div className="flex items-center gap-5 text-muted-foreground text-sm font-semibold">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {fullDate}
                        </span>
                        <span className="flex items-center gap-1.5 border-l pl-5 border-muted-foreground/20">
                            <Clock className="h-4 w-4" />
                            {time}
                        </span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-4 break-words whitespace-normal">
                    {title || 'Sarlavha kiritilmagan'}
                </h1>
            </div>

            {post.url && post.url.length > 0 && (
                <section className="mb-20 space-y-6">
                    <div className="relative aspect-21/9 w-full overflow-hidden rounded-[2.5rem] bg-muted shadow-2xl border border-muted/20">
                        {activeMedia && isVideo(activeMedia) ? (
                            <video
                                key={activeMedia}
                                src={`${baseUrl}${activeMedia}`}
                                controls
                                className="h-full w-full object-cover"
                                autoPlay
                            />
                        ) : (
                            <Image
                                src={`${baseUrl}${activeMedia || post.url[0]}`}
                                alt={title}
                                fill
                                unoptimized
                                priority
                                className="object-cover transition-all duration-500"
                            />
                        )}
                    </div>
                    {post.url.length > 1 && (
                        <div className="flex flex-wrap gap-4">
                            {post.url.map((media: string, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveMedia(media)}
                                    className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm ${
                                        activeMedia === media
                                            ? 'border-primary scale-105 shadow-md'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    {isVideo(media) ? (
                                        <div className="h-full w-full bg-foreground flex items-center justify-center text-[8px] text-background font-black">
                                            VIDEO
                                        </div>
                                    ) : (
                                        <Image
                                            src={`${baseUrl}${media}`}
                                            alt=""
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                <div className="lg:col-span-8 w-full max-w-full overflow-hidden">
                    <article className="prose prose-zinc dark:prose-invert max-w-none text-justify">
                        {(content && content !== '<p></p>' && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: content,
                                }}
                                className="ql-editor p-0! font-medium text-lg md:text-xl leading-[1.8] text-foreground/80
                                       **:bg-transparent! **:text-current! wrap-anywhere whitespace-normal"
                            />
                        )) || (
                            <div className="text-xl">Ma'lumot kiritilmagan</div>
                        )}
                    </article>
                </div>

                <aside className="lg:col-span-4">
                    <div className="sticky top-10 space-y-10">
                        <div className="space-y-6">
                            <h3 className="font-black text-2xl tracking-tighter text-foreground border-b pb-4 border-muted">
                                So&apos;nggi yangiliklar
                            </h3>
                            <div className="space-y-8">
                                {latestNews?.map((item: any) => (
                                    <Link
                                        key={item.id}
                                        href={`/admin/media/${item.id}`}
                                        className="group block space-y-3"
                                    >
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
                                            <Image
                                                src={`${baseUrl}${item.url?.[0]}`}
                                                alt=""
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <h4 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {getLocalizedValue(item.title)}
                                        </h4>
                                        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            Batafsil{' '}
                                            <ArrowRight className="ml-2 h-3 w-3" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-[#0A0A3D] text-background border-2 border-slate-200">
                            <h4 className="font-black text-lg mb-2 dark:text-white">
                                Obuna bo&apos;ling
                            </h4>
                            <p className="text-xs font-medium text-background/70 mb-6 leading-relaxed dark:text-white">
                                Eng so&apos;nggi texnologik yangiliklarni
                                Telegram orqali qabul qiling.
                            </p>
                            <Button
                                className="w-full bg-[#432DD7] text-white hover:bg-background/90 font-black rounded-xl h-12"
                                asChild
                            >
                                <Link href="https://t.me/samarqandinvestkompaniyasi">
                                    Telegram Kanal
                                </Link>
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    )
}

export default AdminPublicationItem
