import { useState, useCallback, useEffect, useRef } from 'react'
import type { SortingState } from '@tanstack/react-table'
import type { FilterState } from '@/components/ui/DataTable'
import { useDebounce } from './useDebounce'

export interface ServerDataQuery {
  page: number
  perPage: number
  sorting: SortingState
  filters: FilterState
  search: string
  signal: AbortSignal
}

export interface ServerDataResponse<T> {
  data: T[]
  total: number
  totalPages?: number
}

export interface UseServerDataTableOptions<T> {
  fetchData: (query: ServerDataQuery) => Promise<ServerDataResponse<T>>
  initialPage?: number
  initialPerPage?: number
  initialSorting?: SortingState
  initialFilters?: FilterState
  debounceSearchMs?: number
  autoFetch?: boolean
}

/**
 * useServerDataTable - Hook empresarial para orquestar DataTable en modo remoto (server-side).
 * Maneja concurrencia con AbortController, debounce en búsqueda, y devuelve props
 * compatibles directamente con <DataTable {...serverTable.tableProps} />.
 */
export function useServerDataTable<T extends { id: string | number }>({
  fetchData,
  initialPage = 1,
  initialPerPage = 10,
  initialSorting = [],
  initialFilters = {},
  debounceSearchMs = 350,
  autoFetch = true,
}: UseServerDataTableOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearch = useDebounce(search, debounceSearchMs)
  const abortControllerRef = useRef<AbortController | null>(null)

  const executeFetch = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchData({
        page,
        perPage,
        sorting,
        filters,
        search: debouncedSearch,
        signal: controller.signal,
      })

      if (!controller.signal.aborted) {
        setData(response.data)
        setTotal(response.total)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err : new Error(String(err)))
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [fetchData, page, perPage, sorting, filters, debouncedSearch])

  useEffect(() => {
    if (autoFetch) {
      let isMounted = true
      queueMicrotask(() => {
        if (isMounted) {
          void executeFetch()
        }
      })
      return () => {
        isMounted = false
      }
    }
  }, [executeFetch, autoFetch])

  // Reset a página 1 cuando cambia búsqueda o filtros
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }, [])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
    setPage(1)
  }, [])

  const refetch = useCallback(() => {
    return executeFetch()
  }, [executeFetch])

  return {
    data,
    total,
    page,
    perPage,
    sorting,
    filters,
    search,
    isLoading,
    error,
    refetch,
    setPage,
    setPerPage,
    setSearch: handleSearchChange,
    setFilters: handleFilterChange,
    setSorting: handleSortingChange,
    /**
     * Props listas para esparcir directamente en <DataTable {...tableProps} />
     */
    tableProps: {
      data,
      isLoading,
      searchable: true,
      searchValue: search,
      onSearch: handleSearchChange,
      filterValues: filters,
      onFilterChange: handleFilterChange,
      sorting,
      onSortingChange: handleSortingChange,
      manualSorting: true,
      manualPagination: true,
      manualFiltering: true,
      pagination: {
        page,
        perPage,
        total,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      },
    },
  }
}
