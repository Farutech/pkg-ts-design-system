import React, { useState, useMemo } from 'react';

// ==================== TYPES ====================

export interface Column<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface GlobalAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  tooltip?: string;
}

export interface RowAction<T = any> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  disabled?: (record: T) => boolean;
  tooltip?: string;
  showInMenu?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'multiselect' | 'custom';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  render?: (onChange: (value: any) => void, value: any) => React.ReactNode;
}

export interface CRUDTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  globalActions?: GlobalAction[];
  rowActions?: RowAction<T>[];
  onCreate?: () => void;
  createLabel?: string;
  showCreateButton?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
  pagination?: boolean;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  currentPage?: number;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  sortable?: boolean;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  exportable?: boolean;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  className?: string;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  bulkActions?: GlobalAction[];
}

export function CRUDTable<T = any>({
  data,
  columns,
  loading = false,
  globalActions = [],
  rowActions = [],
  onCreate,
  createLabel = '+ Nuevo Registro',
  showCreateButton = true,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  onSearch,
  filters = [],
  onFilterChange,
  pagination = true,
  pageSize = 10,
  total,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortable = true,
  onSortChange,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  rowKey,
}: CRUDTableProps<T>) {
  const [localSearch, setLocalSearch] = useState('');
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize] = useState(pageSize);
  const [localSort, setLocalSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const getRowKey = (record: T, index: number): string | number => {
    if (rowKey) {
      return typeof rowKey === 'function' ? rowKey(record) : (record[rowKey as keyof T] as string | number);
    }
    return (record as any)?.uuid || (record as any)?.id || index;
  };

  const processedData = useMemo(() => {
    let result = [...(data || [])];

    if (localSearch && searchable) {
      const searchLower = localSearch.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const value = item[col.key as keyof T];
          return String(value ?? '').toLowerCase().includes(searchLower);
        })
      );
    }

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter((item) => {
          const itemValue = item[key as keyof T];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return String(itemValue) === String(value);
        });
      }
    });

    if (localSort) {
      result.sort((a, b) => {
        const aValue = a[localSort.key as keyof T];
        const bValue = b[localSort.key as keyof T];
        if (aValue < bValue) return localSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return localSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, localSearch, localFilters, localSort, columns, searchable]);

  const totalPages = Math.max(1, Math.ceil((total ?? processedData.length) / localPageSize));

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (localPage - 1) * localPageSize;
    return processedData.slice(start, start + localPageSize);
  }, [processedData, localPage, localPageSize, pagination]);

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    setLocalPage(1);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setLocalPage(1);
    onFilterChange?.(newFilters);
  };

  const handleSort = (key: string) => {
    if (!sortable) return;
    let newDirection: 'asc' | 'desc' = 'asc';
    if (localSort && localSort.key === key && localSort.direction === 'asc') {
      newDirection = 'desc';
    }
    const newSort = { key, direction: newDirection };
    setLocalSort(newSort);
    onSortChange?.(key, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && onSelectionChange) {
      onSelectionChange(processedData);
    } else if (!checked && onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (record: T) => {
    if (!onSelectionChange) return;
    const isSelected = selectedRows.some((row) => getRowKey(row, 0) === getRowKey(record, 0));
    if (isSelected) {
      onSelectionChange(selectedRows.filter((row) => getRowKey(row, 0) !== getRowKey(record, 0)));
    } else {
      onSelectionChange([...selectedRows, record]);
    }
  };


  const getPaginationItems = () => {
    const items: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (localPage > 3) {
        items.push('ellipsis-start');
      }
      const start = Math.max(2, localPage - 1);
      const end = Math.min(totalPages - 1, localPage + 1);
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          items.push(i);
        }
      }
      if (localPage < totalPages - 2) {
        items.push('ellipsis-end');
      }
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }
    return items;
  };

  return (
    <div className={`w-full bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md ${className}`}>
      {/* Barra Superior: Búsqueda y Botones de Creación / Acciones */}
      {(searchable || (onCreate && showCreateButton) || globalActions.length > 0) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-slate-800 bg-slate-950/40">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2.5 ml-auto">
            {globalActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => action.onClick()}
                disabled={action.disabled}
                title={action.tooltip}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                  action.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}

            {onCreate && showCreateButton && (
              <button
                type="button"
                onClick={onCreate}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-950/50 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {createLabel.trim().startsWith("+") ? createLabel.trim() : `+ ${createLabel.trim()}`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Barra de Filtros */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-slate-950/30 border-b border-slate-800/80 text-xs">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Filtros:</span>
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-slate-400 text-xs">{filter.label}:</label>
              {filter.type === 'select' && filter.options ? (
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                  value={localFilters[filter.key] ?? ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options.map((opt) => (
                    <option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'text' ? (
                <input
                  type="text"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder={filter.placeholder}
                  value={localFilters[filter.key] ?? ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              ) : filter.render ? (
                filter.render((value: any) => handleFilterChange(filter.key, value), localFilters[filter.key])
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Cargando datos...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <svg className="w-12 h-12 opacity-30 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                {selectable && (
                  <th className="p-3.5 w-12 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-0 cursor-pointer"
                      checked={selectedRows.length === processedData.length && processedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((column) => {
                  const isSorted = localSort?.key === column.key;
                  return (
                    <th
                      key={String(column.key)}
                      style={{ width: column.width, textAlign: column.align }}
                      className={`p-3.5 font-semibold text-slate-300 ${
                        column.sortable && sortable ? 'cursor-pointer hover:text-white select-none transition-colors' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{column.label}</span>
                        {column.sortable && sortable && (
                          <span className="text-[10px] text-slate-500">
                            {isSorted ? (localSort?.direction === 'desc' ? '▼' : '▲') : '⇅'}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                {rowActions.length > 0 && (
                  <th className="p-3.5 text-right font-semibold text-slate-300">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-transparent">
              {paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                return (
                  <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                    {selectable && (
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-0 cursor-pointer"
                          checked={selectedRows.some((row) => getRowKey(row, 0) === key)}
                          onChange={() => handleSelectRow(record)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        style={{ textAlign: column.align }}
                        className="p-3.5 text-slate-200 text-sm align-middle"
                      >
                        {(() => {
                          const val = record[column.key as keyof T];
                          if (column.render) return column.render(val, record, index);
                          if (val === null || val === undefined || val === '') {
                            return <span className="text-slate-600 font-mono text-xs select-none">—</span>;
                          }
                          return String(val);
                        })()}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="p-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {rowActions
                            .filter((action) => !action.showInMenu)
                            .map((action) => (
                              <button
                                key={action.id}
                                type="button"
                                onClick={() => action.onClick(record)}
                                disabled={action.disabled?.(record)}
                                title={action.tooltip}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                  action.variant === 'danger'
                                    ? 'bg-rose-600/20 text-rose-300 border border-rose-600/40 hover:bg-rose-600 hover:text-white'
                                    : action.variant === 'secondary'
                                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                                    : 'bg-primary-600 text-white hover:bg-primary-500'
                                }`}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación Estandarizada */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Página</span>
            <span className="font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
              {localPage}
            </span>
            <span>de</span>
            <span className="font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
              {totalPages}
            </span>
            <span className="mx-2 text-slate-600">|</span>
            <span>Mostrando {processedData.length === 0 ? 0 : (localPage - 1) * localPageSize + 1} a {Math.min(localPage * localPageSize, total ?? processedData.length)} de <strong className="text-slate-200">{total ?? processedData.length}</strong> registros</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Primero */}
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => setLocalPage(1)}
              disabled={localPage <= 1}
              title="Ir a la primera página"
            >
              <span>⏮</span>
              <span className="hidden md:inline">Primero</span>
            </button>

            {/* Anterior */}
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => setLocalPage(localPage - 1)}
              disabled={localPage <= 1}
              title="Página anterior"
            >
              <span>◀</span>
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1 mx-1">
              {getPaginationItems().map((item, idx) => {
                if (typeof item === 'string') {
                  return (
                    <span key={item + idx} className="px-1.5 py-1 text-slate-500 font-bold select-none">
                      ...
                    </span>
                  );
                }
                const isActive = item === localPage;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLocalPage(item)}
                    className={'min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ' + (
                      isActive
                        ? 'bg-indigo-600 text-white border border-indigo-400 shadow-md shadow-indigo-600/30 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Siguiente */}
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => setLocalPage(localPage + 1)}
              disabled={localPage >= totalPages}
              title="Página siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span>▶</span>
            </button>

            {/* Último */}
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => setLocalPage(totalPages)}
              disabled={localPage >= totalPages}
              title="Ir a la última página"
            >
              <span className="hidden md:inline">Último</span>
              <span>⏭</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRUDTable;
