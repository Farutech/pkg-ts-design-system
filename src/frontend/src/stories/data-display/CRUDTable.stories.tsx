import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CRUDTable,
  type Column,
  DEFAULT_PER_PAGE_OPTIONS,
} from '@/components/crud/CRUDTable'
import { Badge } from '@/components/ui/Badge'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'Admin' | 'Editor' | 'Vista'
  departamento: string
  activo: boolean
  ultimoAcceso: string
}

const SAMPLE_USERS: Usuario[] = [
  { id: '1', nombre: 'Ana García', email: 'ana@empresa.com', rol: 'Admin', departamento: 'Tecnología', activo: true, ultimoAcceso: '2026-09-30' },
  { id: '2', nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'Editor', departamento: 'Marketing', activo: true, ultimoAcceso: '2026-09-29' },
  { id: '3', nombre: 'María Torres', email: 'maria@empresa.com', rol: 'Vista', departamento: 'Ventas', activo: true, ultimoAcceso: '2026-09-15' },
  { id: '4', nombre: 'Pedro Sánchez', email: 'pedro@empresa.com', rol: 'Editor', departamento: 'Tecnología', activo: false, ultimoAcceso: '2026-08-22' },
  { id: '5', nombre: 'Laura Martínez', email: 'laura@empresa.com', rol: 'Admin', departamento: 'RRHH', activo: true, ultimoAcceso: '2026-09-30' },
  { id: '6', nombre: 'Diego Ramírez', email: 'diego@empresa.com', rol: 'Vista', departamento: 'Operaciones', activo: true, ultimoAcceso: '2026-09-28' },
  { id: '7', nombre: 'Sofía Herrera', email: 'sofia@empresa.com', rol: 'Editor', departamento: 'Marketing', activo: false, ultimoAcceso: '2026-07-10' },
  { id: '8', nombre: 'Tomás Ruiz', email: 'tomas@empresa.com', rol: 'Vista', departamento: 'Ventas', activo: true, ultimoAcceso: '2026-09-26' },
  { id: '9', nombre: 'Valentina Díaz', email: 'valen@empresa.com', rol: 'Admin', departamento: 'Tecnología', activo: true, ultimoAcceso: '2026-09-30' },
  { id: '10', nombre: 'Sebastián Romero', email: 'sebas@empresa.com', rol: 'Editor', departamento: 'RRHH', activo: true, ultimoAcceso: '2026-09-29' },
  { id: '11', nombre: 'Camila Vega', email: 'cami@empresa.com', rol: 'Vista', departamento: 'Operaciones', activo: true, ultimoAcceso: '2026-09-25' },
  { id: '12', nombre: 'Felipe Ortiz', email: 'felipe@empresa.com', rol: 'Editor', departamento: 'Marketing', activo: true, ultimoAcceso: '2026-09-24' },
]

const columns: Column<Usuario>[] = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'rol',
    label: 'Rol',
    sortable: true,
    render: (v) => <Badge variant={v === 'Admin' ? 'danger' : v === 'Editor' ? 'warning' : 'neutral'}>{v as string}</Badge>,
  },
  { key: 'departamento', label: 'Departamento', sortable: true },
  {
    key: 'activo',
    label: 'Estado',
    render: (v) => (
      <Badge variant={(v as boolean) ? 'success' : 'neutral'}>
        {(v as boolean) ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
]

const meta = {
  title: '5-Data Display/CRUDTable',
  component: CRUDTable,
  parameters: {
    docs: {
      description: {
        component: `
**CRUDTable** — Tabla CRUD con paginación, búsqueda, sorting y acciones globales/por fila.

Paginación interna con **CrudPagination**:
- \`perPageOptions\`: opciones configurables (default: [10, 25, 50, 100])
- \`showJumpToPage\`: input "Ir a página" (default: true)
- \`pageSize\`: tamaño de página inicial

**Nota**: Para CRUDs más complejos (filtros avanzados, modales, bulk actions) usa el wrapper \`AdminCatalogSection\` o \`CRUDPage\`.
        `,
      },
    },
    viewport: { defaultViewport: 'desktop' },
  },
  argTypes: {
    pageSize: {
      control: { type: 'select' },
      options: [5, 10, 25, 50, 100],
      description: 'Tamaño de página inicial',
    },
    perPageOptions: {
      control: 'object',
      description: 'Opciones del selector "Por página"',
    },
    showJumpToPage: {
      control: 'boolean',
      description: 'Habilitar input "Ir a página"',
    },
    searchable: { control: 'boolean' },
    showCreateButton: { control: 'boolean' },
    sortable: { control: 'boolean' },
  },
  args: {
    pageSize: 5,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
    showJumpToPage: true,
    searchable: true,
    showCreateButton: true,
    sortable: true,
    createLabel: '+ Nuevo Usuario',
    searchPlaceholder: 'Buscar por nombre o email...',
    emptyMessage: 'No hay usuarios que coincidan con los filtros.',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '1.5rem',
          background: 'var(--ft-color-background, #0b0d12)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as Meta<any>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default: 5 por página, 12 usuarios = 3 páginas.
 */
export const Default: Story = {
  args: {
    data: SAMPLE_USERS,
    columns,
  },
}

/**
 * Catálogo pequeño — perPageOptions reducidas.
 */
export const SmallPerPageOptions: Story = {
  args: {
    data: SAMPLE_USERS,
    columns,
    pageSize: 3,
    perPageOptions: [3, 10, 25],
  },
}

/**
 * Sin paginación — útil para listas pequeñas que caben en una pantalla.
 */
export const NoPagination: Story = {
  args: {
    data: SAMPLE_USERS,
    columns,
    pagination: false,
  },
}

/**
 * Sin búsqueda ni botón "Crear" — vista compacta.
 */
export const MinimalToolbar: Story = {
  args: {
    data: SAMPLE_USERS,
    columns,
    searchable: false,
    showCreateButton: false,
  },
}

/**
 * Sin jump-to-page — paginación estándar.
 */
export const WithoutJumpToPage: Story = {
  args: {
    data: SAMPLE_USERS,
    columns,
    showJumpToPage: false,
  },
}

/**
 * Vista vacía — útil para validar el estado "sin resultados".
 */
export const Empty: Story = {
  args: {
    data: [],
    columns,
  },
}

/**
 * Mobile (375px) — para validar responsiveness.
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  args: {
    data: SAMPLE_USERS,
    columns,
    pageSize: 3,
  },
}

/**
 * Tablet (iPad 768px).
 */
export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
  args: {
    data: SAMPLE_USERS,
    columns,
    pageSize: 5,
  },
}

/**
 * Laptop (1280px).
 */
export const Laptop: Story = {
  parameters: { viewport: { defaultViewport: 'laptop' } },
  args: {
    data: SAMPLE_USERS,
    columns,
    pageSize: 8,
  },
}