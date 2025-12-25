import { baseBackendUrl } from '@/models/axios'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ menu: string }>
}) {
    const { menu } = await params
    const t = await getTranslations()
    const menuData = await fetch(`${baseBackendUrl}/menu`).then((res) =>
        res.json()
    )
    const store = await cookies()
    const locale = store.get('locale')?.value || 'uz'
    const titleLocalized = menuData.find((item: any) => item.slug === menu)
        .name[locale]
    return {
        title: t('Admin Panel') + ' | ' + titleLocalized,
        description: titleLocalized,
    }
}

const Page = async ({ params }: { params: Promise<{ menu: string }> }) => {
    const { menu } = await params

    return <div>Page: {menu}</div>
}

export default Page
