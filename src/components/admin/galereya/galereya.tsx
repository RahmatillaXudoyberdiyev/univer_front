import { emptyLocalized } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { GalereyaTableClient } from './galereya-table-client'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const AdminGalereya = async () => {
    const t = await getTranslations()

    const formDataDefaults = {
        name: emptyLocalized(),
        order: 0,
        static: false,
    }

    const fields = [
        {
            name: 'name',
            label: t('Name'),
            type: 'localized-text',
            required: true,
        },
        { name: 'slug', label: t('Path name'), type: 'text', required: true },
        { name: 'order', label: t('Order'), type: 'number', required: true },
        { name: 'static', label: t('Static'), type: 'checkbox' },
    ]

    const menuData = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/menu`
    ).then((res) => res.json())

    return (
        <div className="w-full p-10">
            <GalereyaTableClient
                data={menuData}
                API_URL={API_URL}
                fields={fields}
                formDataDefaults={formDataDefaults}
            />
        </div>
    )
}

export default AdminGalereya
