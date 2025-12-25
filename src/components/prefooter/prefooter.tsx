'use client'

import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

const Prefooter = () => {
    const locale = useLocale()
    const t = useTranslations()
    const { data: menus } = useQuery({
        queryKey: ['menus'],
        queryFn: async () => {
            const res = await api.get('/menu')
            return res.data
        },
    })

    return (
        <div className="bg-[#F5F5F7] dark:bg-[#0A0A3D] py-10">
            <div className="grid grid-cols-2 xl:grid-cols-4 container-cs gap-10">
                {menus?.map((menu: any) => (
                    <div key={menu.slug}>
                        <h1 className="text-2xl font-semibold mb-4">
                            {menu.name?.[locale] ||
                                menu.name?.uz ||
                                t('Nomalum')}
                        </h1>
                        <ul className="space-y-2">
                            {menu.submenus?.map((submenu: any) => (
                                <li key={submenu.slug}>
                                    <a href={`/${menu.slug}/${submenu.slug}`}>
                                        {submenu.name?.[locale] ||
                                            submenu.name?.uz ||
                                            t('Nomalum')}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Prefooter
