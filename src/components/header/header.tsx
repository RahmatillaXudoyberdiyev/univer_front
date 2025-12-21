'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const Header = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null)

    const menuItems = [
        {
            title: 'Bosh sahifa',
            items: { default: '/' },
        },
        {
            title: 'Boshqarma',
            items: {
                default: '',
                Rahbariyat: '/rahbariyat',
                'Tarkibiy tuzilma': '/tarkibiy-tuzilma',
                'Vazifalari va funksiyalari': '/vazifalar',
                "Bo'sh ish o'rinlari": '/bosh-ish-orinlari',
                'Fuqorolarni qabul qilish': '/qabul',
                'Korrupsiyaga qarshi kurashish': '/korrupsiya',
            },
        },
        {
            title: 'Investor uchun',
            items: {
                default: '',
                Imkoniyatlar: '/imkoniyatlar',
                Loyihalar: '/loyihalar',
                Hujjatlar: '/hujjatlar',
                Statistika: '/statistika',
            },
        },
        {
            title: 'Shahar va tumanlar',
            items: {
                default: '',
                Toshkent: '/toshkent',
                Andijon: '/andijon',
                "Farg'ona": '/fargona',
                Samarqand: '/samarqand',
                Buxoro: '/buxoro',
                Xorazm: '/xorazm',
            },
        },
        {
            title: 'Qonunchilik',
            items: {
                default: '',
                Qonunlar: '/qonunlar',
                Farmonlar: '/farmonlar',
                Qarorlar: '/qarorlar',
                "Me'yoriy hujjatlar": '/meyoriy-hujjatlar',
            },
        },
        {
            title: 'Tashqi savdo',
            items: {
                default: '',
                Eksport: '/eksport',
                Import: '/import',
                Hamkorlar: '/hamkorlar',
                Shartnomalar: '/shartnomalar',
            },
        },
        {
            title: "Ochiq ma'lumotlar",
            items: { default: '/ochiq-malumotlar' },
        },
        {
            title: 'Galereya',
            items: {
                default: '',
                Foto: '/galereya/rasmlar',
                Video: '/galereya/videolar',
            },
        },
    ]

    return (
        <div className="sticky top-0 z-50 w-full bg-[#0A0A3D] text-white">
            <div className="container-cs">
                <ul className="hidden md:flex flex-wrap">
                    {menuItems.map((menu, index) => {
                        const hasDropdown =
                            Object.keys(menu.items).length > 1 ||
                            !menu.items['default']
                        return (
                            <li
                                key={index}
                                className="relative group"
                                onMouseEnter={() =>
                                    hasDropdown && setActiveMenu(index)
                                }
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                {menu.items['default'] ? (
                                    <Link
                                        href={menu.items['default']}
                                        className="flex items-center gap-1.5 px-4 py-5 hover:bg-white/5 transition-colors duration-200 whitespace-nowrap"
                                    >
                                        <span>{menu.title}</span>
                                        {hasDropdown && (
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-300 ${
                                                    activeMenu === index
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <button className="flex items-center gap-1.5 px-4 py-5 hover:bg-white/5 transition-colors duration-200 whitespace-nowrap">
                                        <span>{menu.title}</span>
                                        {hasDropdown && (
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-300 ${
                                                    activeMenu === index
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        )}
                                    </button>
                                )}

                                {hasDropdown && (
                                    <div
                                        className={`absolute left-0 top-full w-64 bg-white dark:bg-slate-900 shadow-2xl border-t-2 border-blue-600 dark:border-blue-500 overflow-hidden transition-all duration-300 z-70 ${
                                            activeMenu === index
                                                ? 'opacity-100 translate-y-0 visible'
                                                : 'opacity-0 -translate-y-2 invisible'
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-transparent pointer-events-none " />
                                        <ul className="py-2">
                                            {Object.entries(menu.items)
                                                .filter(
                                                    ([key]) => key !== 'default'
                                                )
                                                .map(
                                                    (
                                                        [label, path],
                                                        itemIndex
                                                    ) => (
                                                        <li
                                                            key={itemIndex}
                                                            className={`transition-all duration-200 ${
                                                                activeMenu ===
                                                                index
                                                                    ? 'opacity-100 translate-x-0'
                                                                    : 'opacity-0 -translate-x-4'
                                                            }`}
                                                            style={{
                                                                transitionDelay:
                                                                    activeMenu ===
                                                                    index
                                                                        ? `${
                                                                              itemIndex *
                                                                              40
                                                                          }ms`
                                                                        : '0ms',
                                                            }}
                                                        >
                                                            <Link
                                                                href={path}
                                                                className="block px-6 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:pl-8 transition-all duration-200 relative group/item"
                                                            >
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-blue-600 dark:bg-blue-500 group-hover/item:w-1.5 group-hover/item:h-1.5 transition-all duration-200" />
                                                                {label}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Header
