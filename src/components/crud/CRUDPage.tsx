import React, { useState, useMemo, useRef } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import {
  PlusIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export type CRUDRecord = { id: string | number } & Record<string, any>

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
  label: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  onClick: (data: T) => void
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
  
  /** Modo de creación: formulario en modal o navegación a nueva página (default: 'modal') */
  createMode?: 'modal' | 'page'
  /** Modo de edición: formulario en modal o navegación a nueva página (default: 'modal') */
  editMode?: 'modal' | 'page'
  /** Tamaño del modal para crear/editar (default: 'lg') */
  modalSize?: 'sm' | 'md' | 'lg' | 'xl'

  /** Permisos y visibilidad de acciones agrupados */
  permissions?: CRUDPermissions
  /** Shorthands directos para Storybook Controls */
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canView?: boolean
  canPrint?: boolean
  canExport?: boolean
  
  /** Callback al crear un registro */
  onCreate?: (item: Partial<T>) => Promise<void> | void
  /** Callback al editar un registro */
  onEdit?: (item: T) => Promise<void> | void
  /** Callback unificado de guardar (crear o editar) */
  onSave?: (item: Partial<T>) => Promise<void> | void
  /** Callback al eliminar un registro */
  onDelete?: (item: T) => Promise<void> | void
  /** Callback al ver detalles de un registro */
  onView?: (item: T) => void
  /** Callback de impresión personalizada */
  onPrint?: (items: T[]) => void
  /** Callback de exportación personalizada */
  onExport?: (items: T[]) => void

  /** Callback cuando createMode === 'page' */
  onCreatePage?: () => void
  /** Callback cuando editMode === 'page' */
  onEditPage?: (item: T) => void

  /** Acciones adicionales por cada fila */
  customRowActions?: CustomAction<T>[]
  /** Acciones adicionales globales en el toolbar */
  customGlobalActions?: Array<{
    label: string
    icon?: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    onClick: (filteredItems: T[]) => void
  }>

  /** Modo de filtrado: local o mediante llamada a API (default: 'local') */
  filterMode?: 'local' | 'api'
  /** Callback para filtrar vía API con debounce */
  onApiFilter?: (query: string) => Promise<T[]> | void
  /** Alias amigable para Storybook de filtro API */
  onSearchApi?: (query: string) => Promise<T[]> | void
  /** Placeholder del buscador */
  searchPlaceholder?: string
  /** Milisegundos de debounce para el filtro de API (default: 300) */
  debounceMs?: number

  /** Renderizador de formulario personalizado para el modal */
  renderForm?: (props: {
    item: Partial<T> | null
    isEditing: boolean
    onSave: (data: Partial<T>) => void
    onCancel: () => void
  }) => React.ReactNode

  className?: string
}

/**
 * Super Componente CRUDPage — Solución Integral Compuesta para Vistas de Gestión.
 */
export function CRUDPage<T extends { id: string | number } = any>({
  title,
  description,
  data,
  columns,
  fields,
  idKey = 'id' as keyof T,
  createMode = 'modal',
  editMode = 'modal',
  modalSize = 'lg',
  permissions,
  canCreate: canCreateProp,
  canEdit: canEditProp,
  canDelete: canDeleteProp,
  canView: canViewProp,
  canPrint: canPrintProp,
  canExport: canExportProp,
  onCreate,
  onEdit,
  onSave,
  onDelete,
  onView,
  onPrint,
  onExport,
  onCreatePage,
  onEditPage,
  customRowActions = [],
  customGlobalActions = [],
  filterMode = 'local',
  onApiFilter,
  onSearchApi,
  searchPlaceholder = 'Buscar registros...',
  debounceMs = 300,
  renderForm,
  className,
}: CRUDPageProps<T>) {
  const effectivePermissions = {
    canCreate: canCreateProp ?? permissions?.canCreate ?? true,
    canEdit: canEditProp ?? permissions?.canEdit ?? true,
    canDelete: canDeleteProp ?? permissions?.canDelete ?? true,
    canView: canViewProp ?? permissions?.canView ?? true,
    canPrint: canPrintProp ?? permissions?.canPrint ?? true,
    canExport: canExportProp ?? permissions?.canExport ?? true,
  }

  const effectiveApiFilter = onSearchApi || onApiFilter
  const isApiMode = Boolean(onSearchApi || onApiFilter || filterMode === 'api')

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [apiFilteredData, setApiFilteredData] = useState<T[] | null>(null)
  const debounceTimer = useRef<any>(null)
  const latestReqId = useRef(0)

  // Estados del modal de Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [modalFormData, setModalFormData] = useState<Record<string, any>>({})
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<T | null>(null)

  // Manejo de búsqueda y debounce
  const handleSearchChange = (q: string) => {
    setSearchQuery(q)

    if (isApiMode && effectiveApiFilter) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      setIsSearching(true)
      const reqId = ++latestReqId.current

      debounceTimer.current = setTimeout(async () => {
        try {
          const result = await effectiveApiFilter(q)
          if (latestReqId.current === reqId && Array.isArray(result)) {
            setApiFilteredData(result)
          }
        } catch {
          // Mantener datos previos en caso de fallo
        } finally {
          if (latestReqId.current === reqId) {
            setIsSearching(false)
          }
        }
      }, debounceMs)
    }
  }

  // Filtrado de datos local
  const effectiveData = useMemo(() => {
    if (isApiMode && apiFilteredData !== null) {
      return apiFilteredData
    }
    if (!searchQuery.trim() || isApiMode) {
      return data
    }
    const term = searchQuery.toLowerCase()
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    )
  }, [data, searchQuery, isApiMode, apiFilteredData])

  // Impresión nativa o callback
  const handlePrint = () => {
    if (onPrint) {
      onPrint(effectiveData)
    } else {
      window.print()
    }
  }

  // Exportación a CSV
  const handleExport = () => {
    if (onExport) {
      onExport(effectiveData)
      return
    }

    if (!effectiveData || effectiveData.length === 0) return

    const keys = Object.keys(effectiveData[0])
    const csvContent = [
      keys.join(','),
      ...effectiveData.map((row) =>
        keys.map((k) => `"${String((row as any)[k] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Apertura de Crear
  const handleOpenCreate = () => {
    if (createMode === 'page') {
      onCreatePage?.()
      return
    }
    setEditingItem(null)
    setModalFormData({})
    setIsModalOpen(true)
  }

  // Apertura de Editar
  const handleOpenEdit = (item: T) => {
    if (editMode === 'page') {
      onEditPage?.(item)
      return
    }
    setEditingItem(item)
    setModalFormData({ ...item })
    setIsModalOpen(true)
  }

  // Confirmar Guardado en modal
  const handleModalSave = async (savedData?: Partial<T>) => {
    const finalData = savedData || (modalFormData as Partial<T>)
    if (editingItem) {
      await onEdit?.({ ...editingItem, ...finalData } as T)
      await onSave?.({ ...editingItem, ...finalData } as T)
    } else {
      await onCreate?.(finalData)
      await onSave?.(finalData)
    }
    setIsModalOpen(false)
    setEditingItem(null)
    setModalFormData({})
  }

  // Confirmar Borrado
  const handleConfirmDelete = async () => {
    if (deleteConfirmItem) {
      await onDelete?.(deleteConfirmItem)
      setDeleteConfirmItem(null)
    }
  }

  // Columnas base (a partir de columns o fields)
  const baseColumns = useMemo<ColumnDef<T, any>[]>(() => {
    if (columns && columns.length > 0) return columns
    if (fields && fields.length > 0) {
      return fields.map((f) => ({
        accessorKey: f.key,
        header: f.label,
        cell: (info: any) => {
          const val = info.getValue()
          if (f.key === 'status' || f.key === 'estado') {
            const variant = String(val).toLowerCase().includes('act') ? 'success' : 'warning'
            return <Badge variant={variant as any}>{String(val ?? '')}</Badge>
          }
          return <span>{String(val ?? '')}</span>
        },
      }))
    }
    return []
  }, [columns, fields])

  // Inyección de columna de acciones
  const tableColumns = useMemo<ColumnDef<T, any>[]>(() => {
    const hasActions =
      effectivePermissions.canEdit ||
      effectivePermissions.canDelete ||
      effectivePermissions.canView ||
      customRowActions.length > 0

    if (!hasActions) return baseColumns

    const actionCol: ColumnDef<T, any> = {
      id: '__crud_actions__',
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-end gap-1.5">
            {effectivePermissions.canView && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 text-gray-500 hover:text-primary-600"
                onClick={() => onView?.(item)}
                title="Ver detalles"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            )}

            {effectivePermissions.canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 text-gray-500 hover:text-amber-600"
                onClick={() => handleOpenEdit(item)}
                title="Editar"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </Button>
            )}

            {customRowActions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'ghost'}
                size="sm"
                className="p-1.5"
                onClick={() => action.onClick(item)}
                title={action.label}
              >
                {action.icon || action.label}
              </Button>
            ))}

            {effectivePermissions.canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 text-gray-500 hover:text-red-600"
                onClick={() => setDeleteConfirmItem(item)}
                title="Eliminar"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    }

    return [...baseColumns, actionCol]
  }, [baseColumns, effectivePermissions, customRowActions])

  const modalWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[modalSize]

  return (
    <div className={cn('space-y-6 w-full', className)}>
      {/* Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          {effectivePermissions.canPrint && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5"
            >
              <PrinterIcon className="h-4 w-4" />
              <span>Imprimir</span>
            </Button>
          )}

          {effectivePermissions.canExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          )}

          {customGlobalActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => action.onClick(effectiveData)}
              className="gap-1.5"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}

          {effectivePermissions.canCreate && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-1.5"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Crear nuevo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={isApiMode ? 'Buscar en API con debounce...' : searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {isSearching && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin h-3.5 w-3.5 border-2 border-primary-500 border-t-transparent rounded-full" />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 w-full sm:w-auto justify-between sm:justify-end">
          <span>Modo de filtro: <Badge variant="default">{isApiMode ? 'API Debounce' : 'Memoria Local'}</Badge></span>
          <span>Total: <strong className="text-gray-900 dark:text-white">{effectiveData.length}</strong></span>
        </div>
      </div>

      {/* Tabla de Datos con Paginación Anexo A */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          data={effectiveData}
          columns={tableColumns}
          selectable
        />
      </div>

      {/* Modal de Creación / Edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Editar registro (${editingItem[idKey]})` : `Crear nuevo registro en ${title}`}
      >
        <div className={cn('space-y-4 py-2', modalWidthClass)}>
          {renderForm ? (
            renderForm({
              item: editingItem,
              isEditing: Boolean(editingItem),
              onSave: handleModalSave,
              onCancel: () => setIsModalOpen(false),
            })
          ) : fields && fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field) => {
                const currentVal = modalFormData[field.key] ?? ''
                if (field.type === 'select' && field.options) {
                  return (
                    <Select
                      key={field.key}
                      label={field.label}
                      value={String(currentVal)}
                      options={field.options}
                      onChange={(e) =>
                        setModalFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      fullWidth
                    />
                  )
                }
                return (
                  <Input
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={String(currentVal)}
                    onChange={(e) =>
                      setModalFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    fullWidth
                  />
                )
              })}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => handleModalSave()}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No se definieron campos para el formulario.</div>
          )}
        </div>
      </Modal>

      {/* Modal de Confirmación de Borrado */}
      <Modal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        title="Confirmar eliminación"
      >
        <div className="space-y-4 py-2 max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que deseas eliminar el registro{' '}
            <strong className="text-gray-900 dark:text-white">
              {deleteConfirmItem ? String(deleteConfirmItem[idKey]) : ''}
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setDeleteConfirmItem(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Eliminar definitivamente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
