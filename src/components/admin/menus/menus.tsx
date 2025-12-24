import { emptyLocalized } from '@/lib/utils'
import { baseBackendUrl } from '@/models/axios'
import { getTranslations } from 'next-intl/server'
import { MenuTableClient } from './menu-table-client'

const AdminMenus = async () => {
  const t = await getTranslations()

  const formDataDefaults = {
    name: emptyLocalized(),
    order: 0,
    static: false,
  }

  const fields = [
    { name: 'name', label: t('Name'), type: 'localized-text', required: true },
    { name: 'slug', label: t('Path name'), type: 'text', required: true },
    { name: 'order', label: t('Order'), type: 'number', required: true },
  ]

  const menuData = await fetch(`${baseBackendUrl}/menu`).then((res) =>
    res.json()
  )

  return (
    <div className="w-full p-10">
      <MenuTableClient
        data={menuData}
        fields={fields}
        formDataDefaults={formDataDefaults}
      />
    </div>
  )
}

export default AdminMenus
