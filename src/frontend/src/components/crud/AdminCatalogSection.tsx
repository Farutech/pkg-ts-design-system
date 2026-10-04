/**
 * AdminCatalogSection
 * ------------------------------------------------------------------
 * Plantilla reutilizable que estandariza la UI de los CRUDs del módulo
 * de Administración, Configuración y Catálogos (proyectos tipo Ordeon).
 *
 * Centraliza:
 *  - Header estandarizado (eyebrow, título, descripción, icono, acciones)
 *  - Buscador con debounce
 *  - Tabla con paginación configurable (perPageOptions + jump-to-page)
 *  - Estados: loading, empty, error
 *
 * Este wrapper NO acopla una API ni un endpoint — recibe `fetchPage`
 * (callback que retorna una página de datos) para que cada catálogo
 * conecte con su servicio correspondiente.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { CrudPagination, DEFAULT_PER_PAGE_OPTIONS } from './CrudPagination'
import { cn } from '@/utils/cn'

export interface AdminCatalogPage<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type AdminCatalogFetcher<T> = (params: {
  page: number
  pageSize: number
  search: string
}) => Promise<AdminCatalogPage<T>>

export interface AdminCatalogSectionProps<T> {
  /** Identificador único para logs y keys internas. */
  id: string
  /** Etiqueta pequeña sobre el título (ej: "ADMINISTRACIÓN > CLIENTES"). */
  eyebrow?: string
  /** Título principal de la sección. */
  title: string
  /** Descripción breve que aparece bajo el título. */
  description?: string
  /** Icono Lucide/Heroicons que se muestra junto al título. */
  icon?: ReactNode
  /** Acciones globales (botones a la derecha del header). */
  headerActions?: ReactNode

  /** Callback para obtener una página de datos desde la API. */
  fetchPage: AdminCatalogFetcher<T>
  /** Render-prop para definir la tabla con los datos de la página actual. */
  renderTable: (params: {
    data: T[]
    isLoading: boolean
    isFetching: boolean
    refresh: () => void
  }) => ReactNode
  /** Render-prop opcional para barra de filtros adicional. */
  renderFilters?: (params: { search: string; onSearchChange: (v: string) => void }) => ReactNode
  /** Render-prop opcional para el slot de modales. */
  renderModals?: ReactNode

  /** Opciones para el selector "Por página". Default: [10, 25, 50, 100]. */
  perPageOptions?: number[]
  /** Tamaño de página inicial. Default: 10. */
  initialPageSize?: number
  /** Mensaje cuando no hay datos. */
  emptyMessage?: string
  /** Placeholder del buscador. */
  searchPlaceholder?: string
  /** Variante de tema para la paginación. */
  paginationVariant?: 'dark' | 'default' | 'transparent'
  /** Permite saltar a una página específica con input numérico. */
  showJumpToPage?: boolean
  /** ClassName adicional para el contenedor raíz. */
  className?: string
}

export function AdminCatalogSection<T>({
  id,
  eyebrow,
  title,
  description,
  icon,
  headerActions,
  fetchPage,
  renderTable,
  renderFilters,
  renderModals,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  initialPageSize = 10,
  emptyMessage = 'No hay registros para mostrar.',
  searchPlaceholder = 'Buscar...',
  paginationVariant = 'dark',
  showJumpToPage = true,
  className,
}: AdminCatalogSectionProps<T>) {
  // ----- Estado de paginación -----
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // ----- Estado de datos -----
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce de búsqueda (300ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  // ----- Carga de datos -----
  const load = async (opts?: { showInitial?: boolean }) => {
    const showInitial = opts?.showInitial ?? false
    if (showInitial) setIsInitialLoading(true)
    else setIsRefreshing(true)
    setError(null)
    try {
      const result = await fetchPage({ page, pageSize, search: debouncedSearch })
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos')
      setData([])
      setTotal(0)
    } finally {
      setIsInitialLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load({ showInitial: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch])

  // ----- Derivados -----
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  )

  const handlePerPageChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const refresh = () => load({ showInitial: isInitialLoading })

  const isFetching = isRefreshing || isInitialLoading

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn('flex flex-col gap-4', className)}
    >
      {/* Header estandarizado */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-start gap-3 min-w-0">
          {icon && (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20"
              aria-hidden
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300/80 mb-1">
                {eyebrow}
              </p>
            )}
            <h2
              id={`${id}-title`}
              className="text-xl md:text-2xl font-bold text-white truncate"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-slate-400 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {headerActions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">{headerActions}</div>
        )}
      </header>

      {/* Buscador + Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={`Buscar en ${title}`}
            className="w-full pl-9 pr-8 py-2 text-sm border border-white/10 rounded-lg bg-[#1c1d26] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors"
          />
          {isFetching && (
            <div
              className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin h-3.5 w-3.5 border-2 border-violet-500 border-t-transparent rounded-full"
              aria-label="Cargando"
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono">
            {total} {total === 1 ? 'registro' : 'registros'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowPathIcon className={cn('h-4 w-4', isFetching && 'animate-spin')} />}
            onClick={() => refresh()}
            aria-label="Recargar"
          >
            Recargar
          </Button>
        </div>
      </div>

      {renderFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {renderFilters({ search, onSearchChange: handleSearchChange })}
        </div>
      )}

      {/* Contenido principal: tabla o estados */}
      <div className="rounded-xl bg-[#15161d] border border-white/10 overflow-hidden">
        {isInitialLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="text-sm">Cargando {title.toLowerCase()}...</p>
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center justify-center gap-3 py-16 text-rose-300">
            <p className="text-sm font-semibold">No se pudo cargar la información</p>
            <p className="text-xs text-slate-400 max-w-md text-center">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => refresh()}>
              Reintentar
            </Button>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
            <p className="text-sm font-semibold text-slate-200">Sin resultados</p>
            <p className="text-xs text-slate-500 max-w-md text-center">{emptyMessage}</p>
          </div>
        ) : (
          renderTable({ data, isLoading: isInitialLoading, isFetching, refresh })
        )}
      </div>

      {/* Paginación */}
      {!isInitialLoading && !error && total > 0 && (
        <CrudPagination
          currentPage={page}
          totalPages={totalPages}
          perPage={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          perPageOptions={perPageOptions}
          showJumpToPage={showJumpToPage}
          variant={paginationVariant}
        />
      )}

      {renderModals}
    </section>
  )
}