import { useState, useMemo, useCallback } from 'react'

export interface UsePaginationOptions {
  total: number
  initialPage?: number
  initialPerPage?: number
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

export interface UsePaginationReturn {
  page: number
  perPage: number
  total: number
  totalPages: number
  canPrev: boolean
  canNext: boolean
  startIndex: number
  endIndex: number
  nextPage: () => void
  prevPage: () => void
  firstPage: () => void
  lastPage: () => void
  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
}

/**
 * usePagination - Motor autónomo de paginación para listas y tablas.
 */
export function usePagination({
  total,
  initialPage = 1,
  initialPerPage = 10,
  onPageChange,
  onPerPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setInternalPage] = useState(initialPage)
  const [perPage, setInternalPerPage] = useState(initialPerPage)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / perPage))
  }, [total, perPage])

  const safePage = Math.min(Math.max(1, page), totalPages)

  const setPage = useCallback((newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages)
    setInternalPage(clamped)
    onPageChange?.(clamped)
  }, [totalPages, onPageChange])

  const setPerPage = useCallback((newPerPage: number) => {
    setInternalPerPage(newPerPage)
    setInternalPage(1)
    onPerPageChange?.(newPerPage)
  }, [onPerPageChange])

  const nextPage = useCallback(() => {
    if (safePage < totalPages) setPage(safePage + 1)
  }, [safePage, totalPages, setPage])

  const prevPage = useCallback(() => {
    if (safePage > 1) setPage(safePage - 1)
  }, [safePage, setPage])

  const firstPage = useCallback(() => setPage(1), [setPage])
  const lastPage = useCallback(() => setPage(totalPages), [setPage, totalPages])

  const startIndex = (safePage - 1) * perPage
  const endIndex = Math.min(startIndex + perPage, total)

  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPage,
    setPerPage,
  }
}
