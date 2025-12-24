'use client'

import { AddSheet } from '../table/actions/AddSheet'
import { DataTable } from '../table/data-table'
import { Menus, useColumns } from './columns'

interface MenuTableClientProps {
  data: Menus[]
  fields: any[]
  formDataDefaults: any
}

export const MenuTableClient = ({
  data,
  fields,
  formDataDefaults,
}: MenuTableClientProps) => {
  const columns = useColumns()

  return (
    <>
      <AddSheet
        route_name="menu"
        fields={fields}
        formDataDefaults={formDataDefaults}
      />
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={[{ id: 'order', desc: false }]}
      />
    </>
  )
}
