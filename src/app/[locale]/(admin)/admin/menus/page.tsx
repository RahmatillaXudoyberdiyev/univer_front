import AdminMenus from '@/components/admin/menus/menus'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations()

  return {
    title: t('Admin Panel') + ' | ' + t('Sahifalar boshqaruvi'),
    description: t(
      'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
    ),
  }
}

const Page = () => {
  return (
    <div>
      <AdminMenus />
    </div>
  )
}

export default Page
