'use client'

import { DataTable } from '../table/data-table'
import { useColumns, Menus } from './columns'
import { AddSheet } from '../table/actions/AddSheet'

interface MenuTableClientProps {
    data: Menus[]
    API_URL: string | undefined
    fields: any[]
    formDataDefaults: any
}

export const MenuTableClient = ({ data, API_URL, fields, formDataDefaults }: MenuTableClientProps) => {
    const columns = useColumns()

    return (
        <>
            <AddSheet
                API_URL={API_URL}
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
