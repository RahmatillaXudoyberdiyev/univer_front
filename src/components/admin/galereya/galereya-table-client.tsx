'use client'

import { AddSheet } from '../table/actions/AddSheet'
import { DataTable } from '../table/data-table'
import { Galereya, useColumns } from './columns'

interface GalereyaTableClientProps {
    data: Galereya[]
    API_URL: string | undefined
    fields: any[]
    formDataDefaults: any
}

export const GalereyaTableClient = ({
    data,
    API_URL,
    fields,
    formDataDefaults,
}: GalereyaTableClientProps) => {
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
