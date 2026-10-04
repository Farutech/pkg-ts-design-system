/**
 * Exports de componentes CRUD
 */

export { CRUDTable } from './CRUDTable'
export { CrudPagination, DEFAULT_PER_PAGE_OPTIONS } from './CrudPagination'
export type { CrudPaginationProps } from './CrudPagination'
export { CrudActions } from './CrudActions'
export { CrudFilters } from './CrudFilters'
export type {
  CRUDTableProps,
  Column,
  GlobalAction,
  RowAction,
  FilterConfig
} from './CRUDTable'
export { CRUDPage } from './CRUDPage'
export type { CRUDPageProps, CRUDFieldConfig, CRUDRecord } from './CRUDPage'
export {
  AdminCatalogSection,
  type AdminCatalogSectionProps,
  type AdminCatalogPage,
  type AdminCatalogFetcher,
} from './AdminCatalogSection'
export {
  AdminCatalogLayout,
  AdminTableHeader,
  AdminTableRow,
  type AdminCatalogLayoutProps,
} from './AdminCatalogLayout'
