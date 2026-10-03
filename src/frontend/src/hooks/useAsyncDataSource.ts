import { useState, useRef, useEffect, useCallback } from 'react'

export interface UseAsyncDataSourceOptions<T> {
  /** Función asíncrona de carga que recibe la consulta y el AbortSignal para cancelación */
  loadData: (query: string, context: { signal: AbortSignal }) => Promise<T[]>
  /** Milisegundos de espera para debounce (default: 300) */
  debounceMs?: number
  /** Cantidad mínima de caracteres antes de disparar la búsqueda (default: 0) */
  minChars?: number
  /** Datos iniciales estáticos */
  initialData?: T[]
  /** Si debe ejecutar la carga inicial de inmediato con query vacía (default: true si minChars == 0) */
  immediate?: boolean
  /** Tamaño máximo de la caché LRU en memoria (default: 50) */
  cacheSize?: number
  /** Número de reintentos automáticos en caso de fallo (default: 0) */
  retryCount?: number
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty'

export interface UseAsyncDataSourceReturn<T> {
  data: T[]
  status: AsyncStatus
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isEmpty: boolean
  error: Error | null
  query: string
  /** Ejecuta una búsqueda inmediata o debounced */
  search: (newQuery: string) => void
  /** Recarga los datos de la consulta actual */
  reload: () => void
  /** Limpia la caché de consultas */
  clearCache: () => void
}

/**
 * useAsyncDataSource:
 * Motor asíncrono para componentes de selección, autocompletado y tablas.
 * Gestiona de forma transparente:
 * - Cancelación de peticiones obsoletas mediante AbortController (sin condiciones de carrera).
 * - Debounce configurable.
 * - Caché en memoria para evitar peticiones duplicadas.
 * - Reintentos automáticos y estados exhaustivos.
 */
export function useAsyncDataSource<T>({
  loadData,
  debounceMs = 300,
  minChars = 0,
  initialData = [],
  immediate = minChars === 0,
  cacheSize = 50,
  retryCount = 0,
}: UseAsyncDataSourceOptions<T>): UseAsyncDataSourceReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [status, setStatus] = useState<AsyncStatus>(initialData.length > 0 ? 'success' : 'idle')
  const [error, setError] = useState<Error | null>(null)
  const [query, setQuery] = useState<string>('')

  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cacheRef = useRef<Map<string, T[]>>(new Map())
  const activeQueryRef = useRef<string>('')

  const executeFetch = useCallback(
    async (searchQuery: string, attempt = 0) => {
      // 1. Cancelar petición en vuelo previa
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // 2. Si la consulta está en caché, devolverla de inmediato
      const cached = cacheRef.current.get(searchQuery)
      if (cached) {
        setData(cached)
        setStatus(cached.length === 0 ? 'empty' : 'success')
        setError(null)
        return
      }

      // 3. Crear nuevo AbortController
      const controller = new AbortController()
      abortControllerRef.current = controller

      setStatus('loading')
      setError(null)

      try {
        const result = await loadData(searchQuery, { signal: controller.signal })

        // Si fue abortada mientras resolvía, no actualizar estado
        if (controller.signal.aborted) return

        // Guardar en caché LRU
        if (cacheRef.current.size >= cacheSize) {
          const firstKey = cacheRef.current.keys().next().value
          if (firstKey !== undefined) cacheRef.current.delete(firstKey)
        }
        cacheRef.current.set(searchQuery, result)

        setData(result)
        setStatus(result.length === 0 ? 'empty' : 'success')
      } catch (err) {
        if (controller.signal.aborted) return

        if (attempt < retryCount) {
          // Reintentar con backoff exponencial
          const delay = Math.pow(2, attempt) * 200
          setTimeout(() => executeFetch(searchQuery, attempt + 1), delay)
          return
        }

        const standardError = err instanceof Error ? err : new Error(String(err))
        setError(standardError)
        setStatus('error')
      }
    },
    [loadData, cacheSize, retryCount]
  )

  const search = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      activeQueryRef.current = newQuery

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (newQuery.length < minChars) {
        setData(initialData)
        setStatus(initialData.length > 0 ? 'success' : 'idle')
        setError(null)
        return
      }

      if (debounceMs <= 0) {
        executeFetch(newQuery)
      } else {
        debounceTimerRef.current = setTimeout(() => {
          executeFetch(newQuery)
        }, debounceMs)
      }
    },
    [minChars, initialData, debounceMs, executeFetch]
  )

  const reload = useCallback(() => {
    cacheRef.current.delete(activeQueryRef.current)
    executeFetch(activeQueryRef.current)
  }, [executeFetch])

  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  useEffect(() => {
    if (immediate) {
      executeFetch('')
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [immediate, executeFetch])

  return {
    data,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isEmpty: status === 'empty',
    error,
    query,
    search,
    reload,
    clearCache,
  }
}
