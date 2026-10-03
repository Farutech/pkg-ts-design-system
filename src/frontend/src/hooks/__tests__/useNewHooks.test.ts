import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'
import { useThrottledCallback } from '../useThrottle'
import { useLocalStorage } from '../useStorage'
import { useServerDataTable } from '../useServerDataTable'

describe('Fase 4 — Suite de Hooks Avanzados', () => {
  describe('usePagination', () => {
    it('debe calcular correctamente páginas, límites y navegación', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 95, initialPerPage: 10 })
      )

      expect(result.current.page).toBe(1)
      expect(result.current.totalPages).toBe(10)
      expect(result.current.canPrev).toBe(false)
      expect(result.current.canNext).toBe(true)
      expect(result.current.startIndex).toBe(0)
      expect(result.current.endIndex).toBe(10)

      act(() => {
        result.current.nextPage()
      })
      expect(result.current.page).toBe(2)
      expect(result.current.canPrev).toBe(true)

      act(() => {
        result.current.lastPage()
      })
      expect(result.current.page).toBe(10)
      expect(result.current.canNext).toBe(false)
      expect(result.current.endIndex).toBe(95)
    })
  })

  describe('useThrottle & useThrottledCallback', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('debe ejecutar callback limitando la frecuencia de invocación', () => {
      const spy = vi.fn()
      const { result } = renderHook(() => useThrottledCallback(spy, 200))

      act(() => {
        result.current('call-1')
        result.current('call-2')
        result.current('call-3')
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('call-1')

      act(() => {
        vi.advanceTimersByTime(200)
      })

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('call-3')
    })
  })

  describe('useLocalStorage & useSessionStorage', () => {
    it('debe leer y escribir estado sincronizado en localStorage', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>('test_key', 'initial')
      )

      expect(result.current[0]).toBe('initial')

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
      expect(window.localStorage.getItem('test_key')).toBe(JSON.stringify('updated'))

      act(() => {
        result.current[2]() // remove
      })

      expect(result.current[0]).toBe('initial')
      expect(window.localStorage.getItem('test_key')).toBeNull()
    })
  })

  describe('useServerDataTable', () => {
    it('debe orquestar consultas remotas y proveer props para DataTable', async () => {
      const mockFetch = vi.fn(async (_q) => ({
        data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        total: 20,
      }))

      const { result } = renderHook(() =>
        useServerDataTable({
          fetchData: mockFetch,
          initialPage: 1,
          initialPerPage: 5,
        })
      )

      expect(result.current.tableProps.manualSorting).toBe(true)
      expect(result.current.tableProps.manualPagination).toBe(true)
      expect(result.current.tableProps.manualFiltering).toBe(true)
    })
  })
})
