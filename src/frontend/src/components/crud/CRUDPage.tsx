import React, { useState, useMemo, useCallback, Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { CrudPagination } from './CrudPagination'
import { Icon } from '@/primitives/icon/Icon'
import { cn } from '@/utils/cn'

export type CRUDRecord = { id: string | number } & Record<string, any>

export type CRUDViewMode = 'table' | 'list'

export interface CRUDFieldConfig<T = any> {
  key: keyof T & string
  label: string
  type?: 'text' | 'number' | 'email' | 'select' | 'date'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
}

export interface CRUDPermissions {
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canView?: boolean
  canPrint?: boolean
  canExport?: boolean
}

export interface CustomAction<T> {
  id?: string
  label: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  onClick: (data: T) => void
  disabled?: (data: T) => boolean
  disabledReason?: string
}

export interface CRUDListConfig<T> {
  titleField?: (item: T) => ReactNode
  subtitleField?: (item: T) => ReactNode
  metaField?: (item: T) => ReactNode
  badgeField?: (item: T) => ReactNode
  renderItem?: (item: T) => ReactNode
}

export interface CRUDViewsConfig<T> {
  default?: CRUDViewMode
  allowed?: CRUDViewMode[]
  table?: {
    columns?: ColumnDef<T, any>[]
    columnSettings?: boolean
  }
  list?: CRUDListConfig<T>
}

export interface CRUDPageProps<T extends { id: string | number } = any> {
  /** Título principal del módulo */
  title: string
  /** Descripción del módulo o entidad */
  description?: string
  /** Conjunto de datos */
  data: T[]
  /** Definición de columnas de la tabla (opcional si se pasan fields) */
  columns?: ColumnDef<T, any>[]
  /** Configuración de campos (para autogenerar tabla y formulario de modal) */
  fields?: CRUDFieldConfig<T>[]
  /** Campo que actúa como identificador único (default: 'id') */
  idKey?: keyof T
  
  /** Configuración moderna de vistas (tabla y lista/tarjetas) */
  views?: CRUDViewsConfig<T> | CRUDViewMode[]
  /** Vista inicial predeterminada ('table' | 'list') */
  defaultView?: CRUDViewMode

  /** Modo de creación: formulario en modal o navegación a nueva página (default: 'modal') */
  createMode?: 'modal' | 'page'
  /** Modo de edición: formulario en modal o navegación a nueva página (default: 'modal') */
  editMode?: 'modal' | 'page'
  /** Tamaño del modal para crear/editar (default: 'lg') */
  modalSize?: 'sm' | 'md' | 'lg' | 'xl'

  /** Permisos y visibilidad de acciones agrupados */
  permissions?: CRUDPermissions
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canView?: boolean
  canPrint?: boolean
  canExport?: boolean
  
  /** Callbacks principales */
  onCreate?: (item: Partial<T>) => Promise<void> | void
  createLabel?: string
  onEdit?: (item: T) => Promise<void> | void
  onSave?: (item: Partial<T>) => Promise<void> | void
  onDelete?: (item: T) => Promise<void> | void
  onBulkDelete?: (selectedIds: Set<string | number>) => Promise<void> | void
  onView?: (item: T) => void
  onPrint?: (items: T[]) => void
  onExport?: (items: T[]) => void
  onRefresh?: () => void

  onCreatePage?: () => void
  onEditPage?: (item: T) => void

  /** Acciones adicionales por cada fila */
  customRowActions?: CustomAction<T>[]
  /** Acciones adicionales globales en el toolbar */
  customGlobalActions?: Array<{
    id?: string
    label: string
    icon?: ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    onClick: (filteredItems: T[]) => void
  }>

  /** Modo de filtrado: local o mediante llamada a API (default: 'local') */
  filterMode?: 'local' | 'api'
  onApiFilter?: (query: string) => Promise<T[]> | void
  onSearchApi?: (query: string) => Promise<T[]> | void
  searchPlaceholder?: string

  loading?: boolean
  isLoading?: boolean
  error?: ReactNode

  /** Paginación configurable */
  pagination?: {
    enabled?: boolean
    pageSize?: number
    pageSizeOptions?: number[]
  } | boolean

  /** Soporte de selección de filas */
  selectable?: boolean
  selectedRows?: Set<any>
  onSelectionChange?: (selectedIds: Set<any>) => void

  /** Ranura de acciones masivas */
  bulkActionsSlot?: (props: { selectedRows: Set<any>; clearSelection: () => void }) => ReactNode

  /** Slots nombrados directos como props */
  beforeContent?: ReactNode
  toolbarStart?: ReactNode
  toolbarEnd?: ReactNode
  toolbarSlot?: ReactNode
  filters?: ReactNode
  filtersSlot?: ReactNode
  headerSlot?: ReactNode
  tableSlot?: ReactNode
  showDensitySwitcher?: boolean
  showColumnVisibility?: boolean
  footer?: ReactNode

  children?: ReactNode
  className?: string
}

// Compound Slot Components
const BeforeContent: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
BeforeContent.displayName = 'CRUDPage.BeforeContent'

const Filters: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
Filters.displayName = 'CRUDPage.Filters'

const ToolbarStart: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
ToolbarStart.displayName = 'CRUDPage.ToolbarStart'

const ToolbarEnd: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
ToolbarEnd.displayName = 'CRUDPage.ToolbarEnd'

const Header: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
Header.displayName = 'CRUDPage.Header'

const Footer: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>
Footer.displayName = 'CRUDPage.Footer'

export function CRUDPageComponent<T extends { id: string | number }>({
  title,
  description,
  data = [],
  columns: explicitColumns,
  fields = [],
  idKey = 'id' as keyof T,
  views,
  defaultView = 'table',
  createMode = 'modal',
  editMode = 'modal',
  modalSize = 'lg',
  permissions,
  canCreate: propCanCreate,
  canEdit: propCanEdit,
  canDelete: propCanDelete,
  canView: propCanView,
  canPrint: _propCanPrint,
  canExport: _propCanExport,
  onCreate,
  createLabel = 'Crear nuevo',
  onEdit,
  onSave,
  onDelete,
  onBulkDelete: _onBulkDelete,
  onView,
  onPrint: _onPrint,
  onExport: _onExport,
  onRefresh,
  onCreatePage,
  onEditPage,
  customRowActions: _customRowActions = [],
  customGlobalActions: _customGlobalActions = [],
  filterMode = 'local',
  onApiFilter: _onApiFilter,
  searchPlaceholder = 'Buscar...',
  loading = false,
  isLoading = false,
  error,
  pagination = true,
  selectable = false,
  selectedRows,
  onSelectionChange,
  bulkActionsSlot,
  toolbarSlot,
  filtersSlot,
  headerSlot,
  tableSlot,
  showDensitySwitcher: _showDensitySwitcher,
  showColumnVisibility: _showColumnVisibility,
  beforeContent: propBeforeContent,
  toolbarStart: propToolbarStart,
  toolbarEnd: propToolbarEnd,
  filters: propFilters,
  footer: propFooter,
  children,
  className,
}: CRUDPageProps<T>) {
  // Extraer slots pasados como hijos directos
  const slots = useMemo(() => {
    let before: ReactNode = propBeforeContent
    let filt: ReactNode = propFilters || filtersSlot
    let toolStart: ReactNode = propToolbarStart || toolbarSlot
    let toolEnd: ReactNode = propToolbarEnd
    let foot: ReactNode = propFooter

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return
      const type = child.type as any
      const name = type?.displayName || type?.name
      const p = (child.props as any) || {}
      if (name === 'CRUDPage.BeforeContent') before = p.children
      else if (name === 'CRUDPage.Filters') filt = p.children
      else if (name === 'CRUDPage.ToolbarStart') toolStart = p.children
      else if (name === 'CRUDPage.ToolbarEnd') toolEnd = p.children
      else if (name === 'CRUDPage.Footer') foot = p.children
    })

    return { before, filt, toolStart, toolEnd, foot }
  }, [children, propBeforeContent, propFilters, filtersSlot, propToolbarStart, toolbarSlot, propToolbarEnd, propFooter])

  // Normalización de vistas (tabla y lista)
  const viewsConfig = useMemo(() => {
    if (!views) return { default: defaultView, allowed: ['table'] as CRUDViewMode[] }
    if (Array.isArray(views)) {
      return { default: defaultView, allowed: views }
    }
    return {
      default: views.default || defaultView,
      allowed: views.allowed || (views.list ? (['table', 'list'] as CRUDViewMode[]) : ['table'] as CRUDViewMode[]),
      table: views.table,
      list: views.list,
    }
  }, [views, defaultView])

  const [activeView, setActiveView] = useState<CRUDViewMode>(viewsConfig.default)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPerPage] = useState(
    typeof pagination === 'object' && pagination.pageSize ? pagination.pageSize : 25
  )

  // Estado de modal de creación / edición
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Permisos efectivos
  const effectiveCanCreate = propCanCreate ?? permissions?.canCreate ?? true
  const effectiveCanEdit = propCanEdit ?? permissions?.canEdit ?? true
  const effectiveCanDelete = propCanDelete ?? permissions?.canDelete ?? true
  const effectiveCanView = propCanView ?? permissions?.canView ?? true

  // Disponibilidad de operación funcional (Regla FaruTech: Permiso + Operación Funcional Conectada)
  const isCreateFunctional = createMode === 'page' ? Boolean(onCreatePage) : Boolean(onCreate || onSave)
  const isEditFunctional = editMode === 'page' ? Boolean(onEditPage) : Boolean(onEdit || onSave)
  const isDeleteFunctional = Boolean(onDelete)
  const isViewFunctional = Boolean(onView)

  const canExecuteCreate = effectiveCanCreate && isCreateFunctional
  const canExecuteEdit = effectiveCanEdit && isEditFunctional
  const canExecuteDelete = effectiveCanDelete && isDeleteFunctional
  const canExecuteView = effectiveCanView && isViewFunctional

  // Filtrado local
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || filterMode === 'api') return data
    const q = searchQuery.toLowerCase()
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val ?? '').toLowerCase().includes(q)
      )
    )
  }, [data, searchQuery, filterMode])

  // Paginación local para vista de lista
  const paginatedData = useMemo(() => {
    if (activeView === 'table') return filteredData
    if (pagination === false || (typeof pagination === 'object' && pagination.enabled === false)) {
      return filteredData
    }
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, activeView, pagination, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1

  const handleOpenCreate = useCallback(() => {
    if (createMode === 'page' && onCreatePage) {
      onCreatePage()
      return
    }
    setEditingItem(null)
    setFormData({})
    setIsModalOpen(true)
  }, [createMode, onCreatePage])

  const handleOpenEdit = useCallback((item: T) => {
    if (editMode === 'page' && onEditPage) {
      onEditPage(item)
      return
    }
    setEditingItem(item)
    setFormData({ ...item })
    setIsModalOpen(true)
  }, [editMode, onEditPage])

  const handleSaveModal = useCallback(async () => {
    if (editingItem) {
      if (onEdit) await onEdit({ ...editingItem, ...formData })
      else if (onSave) await onSave({ ...editingItem, ...formData })
    } else {
      if (onCreate) await onCreate(formData as Partial<T>)
      else if (onSave) await onSave(formData as Partial<T>)
    }
    setIsModalOpen(false)
  }, [editingItem, formData, onEdit, onSave, onCreate])

  // Columnas automáticas de tabla si no se pasan columnas explícitas
  const tableColumns = useMemo<ColumnDef<T, any>[]>(() => {
    if (explicitColumns && explicitColumns.length > 0) return explicitColumns
    if (fields && fields.length > 0) {
      return fields.map((f) => ({
        id: f.key,
        header: f.label,
        accessorKey: f.key,
      }))
    }
    return [{ id: 'id', header: 'ID', accessorKey: 'id' }]
  }, [explicitColumns, fields])

  const isDataLoading = loading || isLoading
  const canSwitchViews = viewsConfig.allowed.length > 1

  return (
    <div className={cn('space-y-5 w-full', className)}>
      {/* 01 · ENCABEZADO */}
      {headerSlot ? (
        headerSlot
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh} aria-label="Actualizar datos">
                <Icon.Spinner className="w-3.5 h-3.5 mr-1.5" />
                Actualizar
              </Button>
            )}

            {effectiveCanCreate && (
              <Button
                variant="primary"
                size="sm"
                disabled={!isCreateFunctional}
                title={!isCreateFunctional ? 'Operación de creación no implementada' : undefined}
                onClick={canExecuteCreate ? handleOpenCreate : undefined}
              >
                <Icon.Plus className="w-4 h-4 mr-1.5 shrink-0" />
                {createLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* RENDERIZADO DE ACCIONES MASIVAS PERSONALIZADAS */}
      {bulkActionsSlot &&
        bulkActionsSlot({
          selectedRows: selectedRows || new Set(),
          clearSelection: () => onSelectionChange?.(new Set()),
        })}

      {/* 02 · CONTENIDO COMPLEMENTARIO (BeforeContent Slot) */}
      {slots.before && (
        <div className="w-full">
          {slots.before}
        </div>
      )}

      {/* 03 · BARRA DE HERRAMIENTAS, BÚSQUEDA Y FILTROS */}
      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-full max-w-sm">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              leftSection={<Icon.Search className="w-4 h-4" />}
              allowClear
              size="sm"
            />
          </div>

          {slots.filt}
          {slots.toolStart}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {slots.toolEnd}

          {/* Conmutador de vista Tabla / Lista (solo si hay más de 1 vista permitida) */}
          {canSwitchViews && (
            <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setActiveView('table')}
                title="Vista de tabla"
                aria-label="Vista de tabla"
                aria-pressed={activeView === 'table'}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
                  activeView === 'table'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon.Menu className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabla</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('list')}
                title="Vista de lista"
                aria-label="Vista de lista"
                aria-pressed={activeView === 'list'}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
                  activeView === 'list'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon.More className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 04 · ÁREA DE REGISTROS (TABLA O LISTA) */}
      {tableSlot ? (
        tableSlot
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-3">
          <Icon.Error className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Error al cargar registros</p>
            <p className="text-xs mt-0.5">{String(error)}</p>
          </div>
        </div>
      ) : activeView === 'table' ? (
        <DataTable<T>
          data={filteredData}
          columns={tableColumns}
          isLoading={isDataLoading}
          searchable={false}
          selectable={selectable}
          selectedRows={selectedRows}
          onSelectionChange={onSelectionChange}
          pagination={
            pagination !== false
              ? {
                  page: currentPage,
                  perPage: pageSize,
                  total: filteredData.length,
                  onPageChange: setCurrentPage,
                  onPerPageChange: setPerPage,
                }
              : undefined
          }
        />
      ) : (
        /* VISTA DE LISTA / TARJETAS */
        <div className="space-y-3">
          {paginatedData.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium">No se encontraron registros</p>
              <p className="text-xs mt-1">Prueba a modificar los filtros o el término de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedData.map((item) => {
                const listCfg = viewsConfig.list
                if (listCfg?.renderItem) {
                  return <div key={String(item[idKey])}>{listCfg.renderItem(item)}</div>
                }

                const itemTitle = listCfg?.titleField ? listCfg.titleField(item) : (item as any).name || (item as any).title || `Registro #${item[idKey]}`
                const itemSubtitle = listCfg?.subtitleField ? listCfg.subtitleField(item) : (item as any).email || (item as any).description
                const itemMeta = listCfg?.metaField ? listCfg.metaField(item) : (item as any).code ? `Código · ${(item as any).code}` : undefined
                const itemBadge = listCfg?.badgeField ? listCfg.badgeField(item) : (item as any).status ? <Badge variant="neutral">{(item as any).status}</Badge> : null

                return (
                  <Card key={String(item[idKey])} padding="md" className="flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {itemMeta && (
                            <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 block mb-1">
                              {itemMeta}
                            </span>
                          )}
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                            {itemTitle}
                          </h3>
                          {itemSubtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {itemSubtitle}
                            </p>
                          )}
                        </div>

                        {itemBadge && <div className="shrink-0">{itemBadge}</div>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap">
                      {effectiveCanView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!canExecuteView}
                          title={!isViewFunctional ? 'Operación de ver detalles no configurada' : !effectiveCanView ? 'Sin permisos para ver' : undefined}
                          onClick={() => canExecuteView && onView?.(item)}
                        >
                          Ver
                        </Button>
                      )}
                      {effectiveCanEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!canExecuteEdit}
                          title={!isEditFunctional ? 'Operación de edición no configurada' : !effectiveCanEdit ? 'Sin permisos para editar' : undefined}
                          onClick={() => canExecuteEdit && handleOpenEdit(item)}
                        >
                          Editar
                        </Button>
                      )}
                      {effectiveCanDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={!canExecuteDelete}
                          title={!isDeleteFunctional ? 'Operación de eliminación no configurada' : !effectiveCanDelete ? 'Sin permisos para eliminar' : undefined}
                          onClick={() => canExecuteDelete && onDelete?.(item)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Paginación en modo Lista */}
          {pagination !== false && totalPages > 1 && (
            <div className="pt-2">
              <CrudPagination
                currentPage={currentPage}
                totalPages={totalPages}
                perPage={pageSize}
                total={filteredData.length}
                onPageChange={setCurrentPage}
                onPerPageChange={(size) => {
                  setPerPage(size)
                  setCurrentPage(1)
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 05 · RESUMEN Y FOOTER (Footer Slot) */}
      {slots.foot && (
        <div className="w-full">
          {slots.foot}
        </div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Editar registro en ${title}` : `Crear nuevo registro en ${title}`}
        size={modalSize}
      >
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === 'select' ? (
                <Select
                  label={field.label}
                  options={field.options || []}
                  value={formData[field.key] || ''}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, [field.key]: val }))}
                  required={field.required}
                />
              ) : (
                <Input
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveModal}>
              {editingItem ? 'Guardar cambios' : 'Crear registro'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Compound Export
export const CRUDPage = Object.assign(CRUDPageComponent, {
  BeforeContent,
  Filters,
  ToolbarStart,
  ToolbarEnd,
  Header,
  Footer,
})
