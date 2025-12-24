'use client'

import type React from 'react'
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import Checkbox from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  Filter,
  Maximize2,
  Minimize2,
  Pin,
  Search,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AiOutlineFileExcel } from 'react-icons/ai'
import * as XLSX from 'xlsx'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardHeader } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'regex'
  | 'caseSensitive'
  | 'multiField'
  | 'custom'

export interface EnhancedFilter {
  columnKey: string
  operator: FilterOperator
  value: any
  value2?: any
  caseSensitive?: boolean
  logicOperator?: 'AND' | 'OR'
}

export interface IColumn {
  key?: string
  dataIndex?: string | string[]
  title: string | (() => ReactNode)
  width?: number | string
  render?: (value: any, record: any, index: number) => ReactNode
  sorter?: boolean | ((a: any, b: any) => number)
  filters?: { text: string; value: any }[]
  filterDropdown?: ReactNode
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  hidden?: boolean
  resizable?: boolean
  copyable?: boolean
  searchable?: boolean
  tooltip?: string | ((value: any, record: any) => string)
  icon?: ReactNode
  filterType?: 'text' | 'number' | 'date' | 'select' | 'multiSelect'
}

export interface IPagination {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  onChange?: (page: number, pageSize: number) => void
  pageSizeOptions?: string[]
  hideOnSinglePage?: boolean
}

export interface IRowSelection {
  type?: 'checkbox' | 'radio'
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void
  onSelect?: (record: any, selected: boolean, selectedRows: any[]) => void
  onSelectAll?: (
    selected: boolean,
    selectedRows: any[],
    changeRows: any[]
  ) => void
  getCheckboxProps?: (record: any) => { disabled?: boolean }
  preserveSelectedRowKeys?: boolean
  hideSelectAll?: boolean
}

export interface IMyTableProps {
  className?: string
  columns: IColumn[]
  dataSource: any[]
  rowKey?: string | ((record: any) => string)
  header?: ReactNode
  bodyClassName?: string
  pagination?: IPagination | false
  rowSelection?: IRowSelection
  expandable?: {
    expandedRowRender?: (record: any, index: number) => ReactNode
    expandRowByClick?: boolean
    defaultExpandAllRows?: boolean
    expandedRowKeys?: (string | number)[]
    onExpand?: (expanded: boolean, record: any) => void
    onExpandedRowsChange?: (expandedRows: (string | number)[]) => void
  }
  scroll?: { x?: number | string; y?: number | string }
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
  showHeader?: boolean
  title?: () => ReactNode
  footer?: () => ReactNode
  rowClassName?: (record: any, index: number) => string
  onRow?: (
    record: any,
    index: number
  ) => {
    onClick?: () => void
    onDoubleClick?: () => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }
  sticky?: boolean
  searchable?: boolean
  exportable?: boolean
  columnVisibility?: boolean
  striped?: boolean
  hoverable?: boolean
  refresh?: boolean
  fullscreen?: boolean
  pinnable?: boolean
  isLoading?: boolean
  showDataCount?: boolean
  rangepickerFilter?: boolean
  dateFilterKey?: string
  defaultPageSize?: number
  exportExcel?: boolean
  staticDataCount?: number
  filterFunction?: (
    data: any[],
    startDate: Date | null,
    endDate: Date | null
  ) => any[]
  showIndexColumn?: boolean
  onSearchChange?: (searchTerm: string) => void
}

const applyEnhancedFilter = (
  value: any,
  filterValue: any,
  operator: FilterOperator,
  filterValue2?: any,
  caseSensitive?: boolean
): boolean => {
  if (value === null || value === undefined) {
    return operator === 'isEmpty'
  }

  const normalizeValue = (v: any) => {
    if (caseSensitive) return String(v)
    return String(v).toLowerCase()
  }

  const normalizeFilter = (f: any) => {
    if (caseSensitive) return String(f)
    return String(f).toLowerCase()
  }

  const strValue = normalizeValue(value)
  const strFilter = normalizeFilter(filterValue)

  switch (operator) {
    case 'equals':
      return strValue === strFilter
    case 'notEquals':
      return strValue !== strFilter
    case 'contains':
      return strValue.includes(strFilter)
    case 'startsWith':
      return strValue.startsWith(strFilter)
    case 'endsWith':
      return strValue.endsWith(strFilter)
    case 'greaterThan':
      return Number(value) > Number(filterValue)
    case 'lessThan':
      return Number(value) < Number(filterValue)
    case 'greaterThanOrEqual':
      return Number(value) >= Number(filterValue)
    case 'lessThanOrEqual':
      return Number(value) <= Number(filterValue)
    case 'between':
      return (
        Number(value) >= Number(filterValue) &&
        Number(value) <= Number(filterValue2)
      )
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value)
    case 'notIn':
      return !Array.isArray(filterValue) || !filterValue.includes(value)
    case 'isEmpty':
      return (
        value === null || value === undefined || String(value).trim() === ''
      )
    case 'isNotEmpty':
      return (
        value !== null && value !== undefined && String(value).trim() !== ''
      )
    case 'regex':
      try {
        const regex = new RegExp(filterValue, caseSensitive ? 'g' : 'gi')
        return regex.test(String(value))
      } catch {
        return false
      }
    default:
      return true
  }
}

const MyTable = ({
  className,
  columns: initialColumns,
  dataSource: initialDataSource,
  rowKey = 'id',
  header,
  bodyClassName,
  pagination = { showSizeChanger: true },
  rowSelection,
  expandable,
  scroll,
  size = 'middle',
  bordered = false,
  showHeader = true,
  title,
  footer,
  rowClassName,
  onRow,
  sticky = false,
  searchable = false,
  columnVisibility = false,
  striped = true,
  hoverable = true,
  refresh = true,
  fullscreen = false,
  pinnable = false,
  isLoading = false,
  showDataCount = true,
  rangepickerFilter = true,
  dateFilterKey = 'createdAt',
  defaultPageSize = 20,
  exportExcel = true,
  staticDataCount,
  showIndexColumn = false,
  onSearchChange,
}: IMyTableProps) => {
  const t = useTranslations()

  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [filters, setFilters] = useState<Record<string, any[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    rowSelection?.selectedRowKeys || []
  )
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
    []
  )
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
  const [pinnedColumns, setPinnedColumns] = useState<{
    left: string[]
    right: string[]
  }>({ left: [], right: [] })
  const [currentPage, setCurrentPage] = useState(
    pagination ? pagination.current || 1 : 1
  )
  const [pageSize, setPageSize] = useState(
    pagination ? pagination.pageSize || defaultPageSize : defaultPageSize
  )

  const [enhancedFilters, setEnhancedFilters] = useState<EnhancedFilter[]>([])
  const [rangePickerStartDate, setRangePickerStartDate] = useState<Date | null>(
    null
  )
  const [rangePickerEndDate, setRangePickerEndDate] = useState<Date | null>(
    null
  )
  const [showDateRangeInputs, setShowDateRangeInputs] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const tableRef = useRef<HTMLDivElement>(null)

  const handleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
    if (tableRef.current) {
      if (!isFullscreen) {
        tableRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  const handleRemoveEnhancedFilter = (index: number) => {
    setEnhancedFilters((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearEnhancedFilters = () => {
    setEnhancedFilters([])
  }

  const getRowKey = useCallback(
    (record: any, index: number) => {
      if (typeof rowKey === 'string') {
        return record[rowKey] ?? `${index}`
      }
      if (typeof rowKey === 'function') {
        return rowKey(record) ?? `${index}`
      }
      return `${index}`
    },
    [rowKey]
  )

  const hasSelection = rowSelection && rowSelection.selectedRowKeys
  const isAllSelected =
    hasSelection &&
    initialDataSource.length > 0 &&
    selectedRowKeys.length === initialDataSource.length
  const isIndeterminate =
    hasSelection &&
    selectedRowKeys.length > 0 &&
    selectedRowKeys.length < initialDataSource.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(initialDataSource.map((item) => getRowKey(item, 0)))
      rowSelection?.onChange?.(
        initialDataSource.map((item) => getRowKey(item, 0)),
        initialDataSource
      )
    } else {
      setSelectedRowKeys([])
    }
    rowSelection?.onSelectAll?.(
      checked,
      checked ? initialDataSource : [],
      checked ? [] : initialDataSource
    )
  }

  const handleRowSelect = (row: any, checked: boolean) => {
    const key = getRowKey(row, 0)
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key)
    setSelectedRowKeys(newSelectedRowKeys)
    const selectedRows = initialDataSource.filter((item) =>
      newSelectedRowKeys.includes(getRowKey(item, 0))
    )
    rowSelection?.onChange?.(newSelectedRowKeys, selectedRows)
    rowSelection?.onSelect?.(row, checked, selectedRows)
  }

  const handleExpandRow = (row: any) => {
    const key = getRowKey(row, 0)
    setExpandedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
    expandable?.onExpand?.(!expandedRowKeys.includes(key), row)
  }

  const handleSort = (columnKey: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key: columnKey, direction: 'asc' }
    })
  }

  const handleFilter = (columnKey: string, values: any[]) => {
    setFilters((prev) => ({ ...prev, [columnKey]: values }))
  }

  const handleColumnPin = (columnKey: string, position: 'left' | 'right') => {
    setPinnedColumns((prev) => {
      const newPinnedColumns = { ...prev }
      if (newPinnedColumns.left.includes(columnKey)) {
        newPinnedColumns.left = newPinnedColumns.left.filter(
          (k) => k !== columnKey
        )
      }
      if (newPinnedColumns.right.includes(columnKey)) {
        newPinnedColumns.right = newPinnedColumns.right.filter(
          (k) => k !== columnKey
        )
      }
      newPinnedColumns[position].push(columnKey)
      return newPinnedColumns
    })
  }

  const columns = useMemo(() => {
    const cols = [...initialColumns]
    if (showIndexColumn) {
      cols.unshift({
        key: '__index__',
        dataIndex: '__index__',
        title: '#',
        width: 60,
        align: 'left',
        fixed: 'left',
        render: (_: any, __: any, index: number) => {
          // Calculate the actual index considering pagination
          const actualIndex = (currentPage - 1) * pageSize + index + 1
          return actualIndex
        },
      })
    }
    return cols
  }, [initialColumns, showIndexColumn, currentPage, pageSize])

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      const columnKey = col.key ?? col.dataIndex
      return !hiddenColumns.includes(columnKey as string)
    })
  }, [columns, hiddenColumns])

  const processedData = useMemo(() => {
    let data = [...(initialDataSource || [])]

    // Apply search term filter
    if (searchTerm) {
      data = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply column filters
    Object.keys(filters).forEach((columnKey) => {
      const filterValues = filters[columnKey]
      if (filterValues && filterValues.length > 0) {
        const column = initialColumns.find(
          (col) => col.key === columnKey || col.dataIndex === columnKey
        )
        if (column && column.filterType) {
          data = data.filter((row) => {
            const value = column.dataIndex
              ? Array.isArray(column.dataIndex)
                ? column.dataIndex.reduce((acc, key) => acc?.[key], row)
                : row[column.dataIndex]
              : undefined

            if (
              column.filterType === 'select' ||
              column.filterType === 'multiSelect'
            ) {
              return filterValues.includes(value)
            }
            return true
          })
        }
      }
    })

    // Apply enhanced filters
    if (enhancedFilters.length > 0) {
      data = data.filter((row) => {
        return enhancedFilters.every((filter) => {
          const column = initialColumns.find(
            (col) =>
              col.key === filter.columnKey || col.dataIndex === filter.columnKey
          )
          if (!column) return true

          const value = column.dataIndex
            ? Array.isArray(column.dataIndex)
              ? column.dataIndex.reduce((acc, key) => acc?.[key], row)
              : row[column.dataIndex]
            : undefined

          return applyEnhancedFilter(
            value,
            filter.value,
            filter.operator,
            filter.value2,
            filter.caseSensitive
          )
        })
      })
    }

    if (
      rangepickerFilter &&
      dateFilterKey &&
      (rangePickerStartDate || rangePickerEndDate)
    ) {
      data = data.filter((row) => {
        const dateValue = row[dateFilterKey]
        if (!dateValue) return false

        const rowDate = new Date(dateValue)
        // Reset time to compare only dates
        rowDate.setHours(0, 0, 0, 0)

        if (rangePickerStartDate) {
          const startDate = new Date(rangePickerStartDate)
          startDate.setHours(0, 0, 0, 0)
          if (rowDate < startDate) return false
        }

        if (rangePickerEndDate) {
          const endDate = new Date(rangePickerEndDate)
          endDate.setHours(0, 0, 0, 0)
          if (rowDate > endDate) return false
        }

        return true
      })
    }

    // Apply sorting
    if (sortConfig) {
      data.sort((a, b) => {
        const key = sortConfig.key
        const direction = sortConfig.direction

        const valueA: any = initialColumns.reduce((acc, col) => {
          if (col.key === key || col.dataIndex === key) {
            return col.dataIndex
              ? Array.isArray(col.dataIndex)
                ? col.dataIndex.reduce((acc, k) => acc?.[k], a)
                : a[col.dataIndex]
              : undefined
          }
          return acc
        }, undefined)

        const valueB: any = initialColumns.reduce((acc, col) => {
          if (col.key === key || col.dataIndex === key) {
            return col.dataIndex
              ? Array.isArray(col.dataIndex)
                ? col.dataIndex.reduce((acc, k) => acc?.[k], b)
                : b[col.dataIndex]
              : undefined
          }
          return acc
        }, undefined)

        if (valueA === undefined || valueB === undefined) return 0

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA)
        }

        if (Number(valueA) < Number(valueB)) {
          return direction === 'asc' ? -1 : 1
        }
        if (Number(valueA) > Number(valueB)) {
          return direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return data
  }, [
    initialDataSource,
    searchTerm,
    filters,
    enhancedFilters,
    rangePickerStartDate,
    rangePickerEndDate,
    sortConfig,
    initialColumns,
    rangepickerFilter,
    dateFilterKey,
  ])

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return processedData.slice(startIndex, endIndex)
  }, [processedData, currentPage, pageSize, pagination])

  useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedRowKeys(rowSelection.selectedRowKeys)
    }
  }, [rowSelection?.selectedRowKeys])

  useEffect(() => {
    if (pagination && pagination.current) {
      setCurrentPage(pagination.current)
    }
  }, [pagination])

  const extractTextContent = (element: any): string => {
    if (!element) return ''
    if (typeof element === 'string' || typeof element === 'number')
      return String(element)
    if (Array.isArray(element)) return element.map(extractTextContent).join(' ')
    if (element.props) {
      if (element.props.children) {
        return extractTextContent(element.props.children)
      }
    }
    return ''
  }

  const handleExportToExcel = () => {
    try {
      // Get visible columns only
      const exportColumns = visibleColumns.filter((col) => {
        const key = col.key || (col.dataIndex as string)
        return key && !hiddenColumns.includes(key)
      })

      // Prepare headers
      const headers = exportColumns.map((col) =>
        typeof col.title === 'string' ? col.title : col.key || col.dataIndex
      )

      // Prepare data rows
      const rows = processedData.map((row, rowIndex) => {
        return exportColumns.map((col) => {
          let value

          if (col.render) {
            const cellDataIndex = col.dataIndex
            let cellData
            if (cellDataIndex) {
              if (Array.isArray(cellDataIndex)) {
                cellData = cellDataIndex.reduce((acc, key) => acc?.[key], row)
              } else {
                cellData = row[cellDataIndex]
              }
            }

            const rendered = col.render(cellData, row, rowIndex)

            if (
              rendered &&
              typeof rendered === 'object' &&
              'props' in rendered
            ) {
              value = extractTextContent(rendered)
            } else {
              value = rendered
            }
          } else if (col.dataIndex) {
            if (Array.isArray(col.dataIndex)) {
              value = col.dataIndex.reduce((acc, key) => acc?.[key], row)
            } else {
              value = row[col.dataIndex]
            }
          }

          if (value === null || value === undefined) return ''
          if (typeof value === 'object') return JSON.stringify(value)
          return value
        })
      })

      // Create worksheet data with headers and rows
      const wsData = [headers, ...rows]

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // Auto-size columns
      const colWidths = headers.map((header, i) => {
        const headerLength = String(header).length
        const maxDataLength = Math.max(
          ...rows.map((row) => String(row[i] || '').length),
          0
        )
        return { wch: Math.max(headerLength, maxDataLength, 10) }
      })
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

      // Generate and download file
      XLSX.writeFile(
        wb,
        `table-export-${new Date().toISOString().split('T')[0]}.xlsx`
      )
    } catch (error) {
      console.error('[v0] Error exporting to Excel:', error)
    }
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          className,
          '',
          isFullscreen && 'fixed inset-0 z-50 bg-background'
        )}
        ref={tableRef}
      >
        <Card className="flex flex-col px-5 h-full hide-scroll">
          <CardHeader className="z-50 px-0 mx-0">
            {(header ||
              title ||
              searchable ||
              columnVisibility ||
              refresh ||
              fullscreen ||
              rangepickerFilter ||
              exportExcel) && (
              <div className="pb-3 border-b">
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2 items-center">
                      {searchable && (
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value)
                              onSearchChange?.(e.target.value)
                            }}
                            className="pl-8"
                          />
                        </div>
                      )}
                      {title ? title() : undefined}

                      {rangepickerFilter && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setShowDateRangeInputs(!showDateRangeInputs)
                            }
                            className={cn(
                              (rangePickerStartDate || rangePickerEndDate) &&
                                'border-primary text-primary'
                            )}
                          >
                            📅 {rangePickerStartDate ? t('Filter') : t('Date')}
                          </Button>
                          {(rangePickerStartDate || rangePickerEndDate) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setRangePickerStartDate(null)
                                setRangePickerEndDate(null)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}

                      {showDataCount && (
                        <div className="font-semibold flex justify-center items-center gap-2">
                          <h3 className="text-base">{t('data count')}:</h3>
                          <span>
                            {staticDataCount || initialDataSource?.length}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {exportExcel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleExportToExcel}
                              disabled={processedData.length === 0}
                            >
                              <AiOutlineFileExcel className="mr-2 w-4 h-4" />
                              {t('Export')}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t('Export to Excel')}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {columnVisibility && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 w-4 h-4" />
                              {t('ustunlar')}
                              <Badge variant="secondary" className="ml-2">
                                {visibleColumns.length}/{initialColumns.length}
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-56"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                          >
                            <DropdownMenuLabel>
                              {t('Column Visibility')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="overflow-y-auto max-h-64">
                              {initialColumns.map((col) => (
                                <DropdownMenuCheckboxItem
                                  key={col.key || (col.dataIndex as string)}
                                  checked={
                                    !hiddenColumns.includes(
                                      col.key || (col.dataIndex as string)
                                    )
                                  }
                                  onCheckedChange={(checked) => {
                                    const columnKey =
                                      col.key || (col.dataIndex as string)
                                    setHiddenColumns((prev) =>
                                      checked
                                        ? prev.filter((k) => k !== columnKey)
                                        : [...prev, columnKey]
                                    )
                                  }}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span>
                                      {typeof col.title === 'string'
                                        ? col.title
                                        : 'Column'}
                                    </span>
                                    <div className="flex gap-1">
                                      {pinnable &&
                                        pinnedColumns.left.includes(
                                          col.key || (col.dataIndex as string)
                                        ) && (
                                          <Pin className="w-3 h-3 text-blue-500" />
                                        )}
                                      {pinnable &&
                                        pinnedColumns.right.includes(
                                          col.key || (col.dataIndex as string)
                                        ) && (
                                          <Pin className="w-3 h-3 text-green-500" />
                                        )}
                                    </div>
                                  </div>
                                </DropdownMenuCheckboxItem>
                              ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setHiddenColumns([])}
                            >
                              <Eye className="mr-2 w-4 h-4" />
                              {t('show all columns')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setHiddenColumns(
                                  initialColumns.map(
                                    (col) =>
                                      col.key || (col.dataIndex as string)
                                  )
                                )
                              }
                            >
                              <EyeOff className="mr-2 w-4 h-4" />
                              {t('hide all columns')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {fullscreen && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              role={'button'}
                              aria-label={'Fullscreen'}
                              variant="outline"
                              size="sm"
                              onClick={handleFullscreen}
                            >
                              {isFullscreen ? (
                                <Minimize2 className="w-4 h-4" />
                              ) : (
                                <Maximize2 className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isFullscreen
                              ? t('Exit fullscreen')
                              : t('Enter fullscreen')}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {header}
                    </div>
                  </div>

                  {rangepickerFilter && showDateRangeInputs && (
                    <div className="flex gap-2 p-3 border rounded-md bg-muted/30">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">
                          {t('qachondan')}
                        </label>
                        <Input
                          type="date"
                          value={
                            rangePickerStartDate
                              ? rangePickerStartDate.toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) => {
                            if (e.target.value) {
                              setRangePickerStartDate(new Date(e.target.value))
                            } else {
                              setRangePickerStartDate(null)
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">
                          {t('qachongacha')}
                        </label>
                        <Input
                          type="date"
                          value={
                            rangePickerEndDate
                              ? rangePickerEndDate.toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) => {
                            if (e.target.value) {
                              setRangePickerEndDate(new Date(e.target.value))
                            } else {
                              setRangePickerEndDate(null)
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowDateRangeInputs(false)}
                        >
                          <Check />
                        </Button>
                      </div>
                    </div>
                  )}

                  {enhancedFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/20">
                      {enhancedFilters.map((filter, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm"
                        >
                          <span>
                            {filter.columnKey}: {filter.operator}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 w-4 h-4"
                            onClick={() => handleRemoveEnhancedFilter(idx)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {enhancedFilters.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearEnhancedFilters}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardHeader>

          {hasSelection && selectedRowKeys.length > 0 && (
            <div className="px-4 py-2 border-b bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {selectedRowKeys.length} {t('selected')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRowKeys([])}
                >
                  {t('clear')}
                </Button>
              </div>
            </div>
          )}

          <div
            className={cn(
              'flex-1 overflow-auto',
              scroll?.x && 'overflow-x-auto',
              scroll?.y && 'overflow-y-auto'
            )}
            style={{ maxHeight: scroll?.y }}
          >
            <Table
              className={cn(
                'thin-scroll',
                size === 'small' && 'text-sm',
                size === 'large' && 'text-base',
                bordered && 'border'
              )}
            >
              {showHeader && (
                <TableHeader
                  className={sticky ? 'sticky top-0 z-10 bg-background' : ''}
                >
                  <TableRow>
                    {hasSelection && (
                      <TableHead className="w-12">
                        {rowSelection?.type !== 'radio' && (
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                            data-state={
                              isIndeterminate
                                ? 'indeterminate'
                                : isAllSelected
                                ? 'checked'
                                : 'unchecked'
                            }
                          />
                        )}
                      </TableHead>
                    )}

                    {expandable && <TableHead className="w-12"></TableHead>}

                    {visibleColumns.map((col, idx) => {
                      const columnKey = col.key ?? col.dataIndex ?? idx
                      const isSorted = sortConfig?.key === columnKey
                      const isPinnedLeft =
                        pinnable &&
                        pinnedColumns.left.includes(columnKey as string)
                      const isPinnedRight =
                        pinnable &&
                        pinnedColumns.right.includes(columnKey as string)

                      return (
                        <TableHead
                          key={columnKey as React.Key}
                          style={{
                            width: col.width,
                            textAlign: col.align,
                            position:
                              isPinnedLeft || isPinnedRight
                                ? 'sticky'
                                : undefined,
                            left: isPinnedLeft ? 0 : undefined,
                            right: isPinnedRight ? 0 : undefined,
                            zIndex:
                              isPinnedLeft || isPinnedRight ? 50 : undefined,
                          }}
                          className={cn(
                            isPinnedLeft || isPinnedRight
                              ? 'bg-background border-r'
                              : '',
                            col.resizable ? 'resize-x overflow-hidden' : '',
                            col.sorter ? 'cursor-pointer hover:bg-muted/50' : ''
                          )}
                          onClick={() =>
                            col.sorter && handleSort(columnKey as string)
                          }
                        >
                          <div className="flex gap-2 items-center">
                            {col.icon && (
                              <span className="text-muted-foreground">
                                {col.icon}
                              </span>
                            )}
                            <span className={col.ellipsis ? 'truncate' : ''}>
                              {typeof col.title === 'function'
                                ? col.title()
                                : col.title}
                            </span>

                            {col.sorter && isSorted && (
                              <div className="ml-auto">
                                {sortConfig?.direction === 'asc' ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <Target className="w-3 h-3 rotate-180" />
                                )}
                              </div>
                            )}

                            {col.filters && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 w-4 h-4"
                                  >
                                    <Filter
                                      className={cn(
                                        'h-3 w-3',
                                        filters[columnKey as string]?.length
                                          ? 'text-primary'
                                          : 'opacity-50'
                                      )}
                                    />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {col.filters.map((filter) => (
                                    <DropdownMenuCheckboxItem
                                      key={filter.value}
                                      checked={filters[
                                        columnKey as string
                                      ]?.includes(filter.value)}
                                      onCheckedChange={(checked) => {
                                        const currentFilters =
                                          filters[columnKey as string] || []
                                        const newFilters = checked
                                          ? [...currentFilters, filter.value]
                                          : currentFilters.filter(
                                              (v) => v !== filter.value
                                            )
                                        handleFilter(
                                          columnKey as string,
                                          newFilters
                                        )
                                      }}
                                    >
                                      {filter.text}
                                    </DropdownMenuCheckboxItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            {pinnable && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 w-4 h-4"
                                  >
                                    <Pin className="w-3 h-3 opacity-50 hover:opacity-100" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleColumnPin(
                                        columnKey as string,
                                        'left'
                                      )
                                    }
                                  >
                                    Pin left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleColumnPin(
                                        columnKey as string,
                                        'right'
                                      )
                                    }
                                  >
                                    Pin right
                                  </DropdownMenuItem>
                                  {(isPinnedLeft || isPinnedRight) && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setPinnedColumns((prev) => ({
                                          left: prev.left.filter(
                                            (k) => k !== columnKey
                                          ),
                                          right: prev.right.filter(
                                            (k) => k !== columnKey
                                          ),
                                        }))
                                      }
                                    >
                                      Unpin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
              )}

              <TableBody className={cn(bodyClassName)}>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_: any, i: number) => (
                    <TableRow key={i}>
                      {Array.from({
                        length:
                          visibleColumns.length +
                          (hasSelection ? 1 : 0) +
                          (expandable ? 1 : 0),
                      }).map((_, i) => (
                        <TableCell key={i}>
                          <Skeleton className="h-4 w-full rounded-md" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <>
                    {paginatedData?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={
                            visibleColumns.length +
                            (hasSelection ? 1 : 0) +
                            (expandable ? 1 : 0)
                          }
                          className="py-8 text-center"
                        >
                          {t('no data')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData?.map((row, rowIdx) => {
                        const key = getRowKey(row, rowIdx)
                        const isSelected = selectedRowKeys.includes(key)
                        const isExpanded = expandedRowKeys.includes(key)
                        const rowProps = onRow?.(row, rowIdx) || {}

                        return (
                          <Fragment key={key}>
                            <TableRow
                              className={cn(
                                isSelected && 'bg-muted/50',
                                rowClassName?.(row, rowIdx),
                                hoverable && 'hover:bg-muted/30',
                                striped && rowIdx % 2 === 0 && 'bg-accent/20'
                              )}
                              onClick={rowProps.onClick}
                              onDoubleClick={rowProps.onDoubleClick}
                              onMouseEnter={rowProps.onMouseEnter}
                              onMouseLeave={rowProps.onMouseLeave}
                            >
                              {hasSelection && (
                                <TableCell>
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked: boolean) =>
                                      handleRowSelect(row, checked)
                                    }
                                    disabled={
                                      rowSelection?.getCheckboxProps?.(row)
                                        ?.disabled
                                    }
                                  />
                                </TableCell>
                              )}

                              {expandable && (
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 w-6 h-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleExpandRow(row)
                                    }}
                                  >
                                    {isExpanded ? (
                                      <Target className="w-4 h-4 rotate-90" />
                                    ) : (
                                      <Target className="w-4 h-4" />
                                    )}
                                  </Button>
                                </TableCell>
                              )}

                              {visibleColumns.map((col, colIdx) => {
                                const columnKey =
                                  col.key ?? col.dataIndex ?? colIdx
                                const isPinnedLeft =
                                  pinnable &&
                                  pinnedColumns.left.includes(
                                    columnKey as string
                                  )
                                const isPinnedRight =
                                  pinnable &&
                                  pinnedColumns.right.includes(
                                    columnKey as string
                                  )

                                let value = col.dataIndex
                                  ? Array.isArray(col.dataIndex)
                                    ? col.dataIndex.reduce(
                                        (acc, key) => acc?.[key],
                                        row
                                      )
                                    : row[col.dataIndex]
                                  : undefined

                                if (col.render) {
                                  value = col.render(value, row, rowIdx)
                                }

                                return (
                                  <TableCell
                                    key={columnKey as React.Key}
                                    style={{
                                      textAlign: col.align,
                                      position:
                                        isPinnedLeft || isPinnedRight
                                          ? 'sticky'
                                          : undefined,
                                      left: isPinnedLeft ? 0 : undefined,
                                      right: isPinnedRight ? 0 : undefined,
                                      zIndex:
                                        isPinnedLeft || isPinnedRight
                                          ? 10
                                          : undefined,
                                    }}
                                    className={cn(
                                      isPinnedLeft ||
                                        (isPinnedRight &&
                                          'bg-background border-r'),
                                      col.ellipsis && 'truncate max-w-0',
                                      col.copyable &&
                                        'cursor-pointer hover:underline'
                                    )}
                                    onClick={() =>
                                      col.copyable &&
                                      navigator.clipboard.writeText(
                                        String(value)
                                      )
                                    }
                                    title={
                                      col.tooltip
                                        ? typeof col.tooltip === 'function'
                                          ? col.tooltip(value, row)
                                          : col.tooltip
                                        : undefined
                                    }
                                  >
                                    {value}
                                  </TableCell>
                                )
                              })}
                            </TableRow>

                            {expandable &&
                              isExpanded &&
                              expandable.expandedRowRender && (
                                <TableRow>
                                  <TableCell
                                    colSpan={
                                      visibleColumns.length +
                                      (hasSelection ? 1 : 0) +
                                      1
                                    }
                                    className="p-0"
                                  >
                                    <div className="p-4 bg-muted/20">
                                      {expandable.expandedRowRender(
                                        row,
                                        rowIdx
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                          </Fragment>
                        )
                      })
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {footer && <div className="z-50 p-4 border-t">{footer()}</div>}
          <div className="">
            {pagination && pagination.showSizeChanger && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('show')}
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    const newPageSize = Number.parseInt(value)
                    setPageSize(newPageSize)
                    setCurrentPage(1)
                    pagination.onChange?.(1, newPageSize)
                  }}
                >
                  <SelectTrigger aria-label={'page size'} className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['10', '20', '30', '50', '100'].map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {t('per page')}
                </span>
              </div>
            )}
          </div>

          {pagination && processedData.length > 0 && (
            <div className="flex z-50 justify-between items-center p-4 border-t">
              <div className="flex gap-2 items-center">
                {pagination.showTotal && (
                  <span className="text-sm text-muted-foreground">
                    {pagination.showTotal(processedData.length, [
                      (currentPage - 1) * pageSize + 1,
                      Math.min(currentPage * pageSize, processedData.length),
                    ])}
                  </span>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  aria-label={'first page of table'}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(1)
                    pagination.onChange?.(1, pageSize)
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>

                <Button
                  aria-label={'previous page of table'}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage - 1
                    setCurrentPage(newPage)
                    pagination.onChange?.(newPage, pageSize)
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="px-2 text-sm">
                  {currentPage} / {Math.ceil(processedData.length / pageSize)}
                </span>

                <Button
                  variant="outline"
                  aria-label={'next page of table'}
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage + 1
                    setCurrentPage(newPage)
                    pagination.onChange?.(newPage, pageSize)
                  }}
                  disabled={
                    currentPage >= Math.ceil(processedData.length / pageSize)
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  aria-label={'last page of table'}
                  size="sm"
                  onClick={() => {
                    const lastPage = Math.ceil(processedData.length / pageSize)
                    setCurrentPage(lastPage)
                    pagination.onChange?.(lastPage, pageSize)
                  }}
                  disabled={
                    currentPage >= Math.ceil(processedData.length / pageSize)
                  }
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default MyTable
