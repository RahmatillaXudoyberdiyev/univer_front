import AdminGalereya from '@/components/admin/galereya/galereya'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('Admin - Galereya'),
    description: t(
      'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
    ),
  }
}

const Page = async () => {
  const store = await cookies()
  const tab = store.get('admin-gallery-tab')?.value
  return (
    <div>
      <AdminGalereya tab={tab as any} />
    </div>
  )
}

export default Page
