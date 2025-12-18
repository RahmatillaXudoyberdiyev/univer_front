'use client'

import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Youtube,
} from 'lucide-react'
import Image from 'next/image'
import logo from '../../../public/logo.png'

const Footer = () => {
    return (
        <footer className="bg-[#0A0A3D] py-12 text-white">
            <div className="container-cs px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Branding Section */}
                    <div className="flex flex-col items-center md:items-start gap-6">
                        <div className="relative p-2 rounded-full bg-white/5 border border-white/10 w-fit">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-lg font-bold text-center md:text-left leading-tight tracking-wide uppercase">
                                Samarqand Viloyati <br />
                                <span className="text-blue-400 font-medium normal-case block mt-1">
                                    Investitsiyalar, sanoat va savdo boshqarmasi
                                </span>
                            </h1>
                        </div>
                        <p className=" text-white/70 text-center md:text-left max-w-lg leading-relaxed">
                            Barcha huquqlar himoyalangan. Saytdagi barcha huquqlar O'zbekiston Respublikasi qonunlariga,
                            shu jumladan mualliflik huquqi va turdosh huquqlarga muvofiq himoya qilinadi.
                            Sayt materiallaridan foydalanganda, Samarqand viloyati Investitsiyalar, sanoat va savdo
                            boshqarmasi saytiga havola ko'rsatilishi shart.
                        </p>
                    </div>

                    {/* Aloqa Section */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold">Aloqa</h2>

                        <div className="space-y-5 text-white/90">
                            <div className="flex items-center gap-4">
                                <Phone size={22} className="text-blue-400" />
                                <a
                                    href="tel:+998662304851"
                                    className="text-base hover:text-blue-400 transition-colors"
                                >
                                    +998-66-230-48-51
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <Mail size={22} className="text-blue-400" />
                                <a
                                    href="mailto:info@saminvest.uz"
                                    className="text-base hover:text-blue-400 transition-colors"
                                >
                                    info@saminvest.uz
                                </a>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin
                                    size={22}
                                    className="text-blue-400 shrink-0"
                                />
                                <p className="text-base leading-relaxed">
                                    O'zbekiston, Samarqand shahar, Ko'ksaroy
                                    maydoni 4A-uy, 104157
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">Ish vaqti:</h3>
                            <p className="text-base text-white/80">
                                Dushanba - Juma: 8:00 dan 18:00 gacha <br />
                                Shanba, Yakshanba: Yopiq
                            </p>
                        </div>

                        {/* Integrated Socials */}
                        <div className="pt-4">
                            <p className="text-[10px] text-white/40 uppercase tracking-[2px] mb-4">
                                Ijtimoiy tarmoqlar
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
