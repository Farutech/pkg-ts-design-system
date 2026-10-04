import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, Settings, Layers, Users } from 'lucide-react'
import {
  AdminCatalogSection,
  type AdminCatalogFetcher,
} from '@/components/crud/AdminCatalogSection'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DEFAULT_PER_PAGE_OPTIONS } from '@/components/crud/CrudPagination'

/**
 * Datos de muestra para una "Sucursal" (catálogo simple).
 */
interface Sucursal {
  id: string
  codigo: string
  nombre: string
  ciudad: string
  responsable: string
  activo: boolean
}

const SAMPLE_DATA: Sucursal[] = [
  { id: 'S-001', codigo: 'BOG-01', nombre: 'Sucursal Norte', ciudad: 'Bogotá', responsable: 'Ana García', activo: true },
  { id: 'S-002', codigo: 'BOG-02', nombre: 'Sucursal Centro', ciudad: 'Bogotá', responsable: 'Carlos López', activo: true },
  { id: 'S-003', codigo: 'MED-01', nombre: 'Sucursal Medellín', ciudad: 'Medellín', responsable: 'María Torres', activo: false },
  { id: 'S-004', codigo: 'CAL-01', nombre: 'Sucursal Cali', ciudad: 'Cali', responsable: 'Pedro Sánchez', activo: true },
  { id: 'S-005', codigo: 'BOG-03', nombre: 'Sucursal Sur', ciudad: 'Bogotá', responsable: 'Laura Martínez', activo: true },
  { id: 'S-006', codigo: 'BUC-01', nombre: 'Sucursal Bucaramanga', ciudad: 'Bucaramanga', responsable: 'Diego Ramírez', activo: true },
  { id: 'S-007', codigo: 'PER-01', nombre: 'Sucursal Pereira', ciudad: 'Pereira', responsable: 'Sofía Herrera', activo: false },
  { id: 'S-008', codigo: 'BOG-04', nombre: 'Sucursal Occidente', ciudad: 'Bogotá', responsable: 'Tomás Ruiz', activo: true },
  { id: 'S-009', codigo: 'BAR-01', nombre: 'Sucursal Barranquilla', ciudad: 'Barranquilla', responsable: 'Valentina Díaz', activo: true },
  { id: 'S-010', codigo: 'CAR-01', nombre: 'Sucursal Cartagena', ciudad: 'Cartagena', responsable: 'Sebastián Romero', activo: true },
  { id: 'S-011', codigo: 'MAN-01', nombre: 'Sucursal Manizales', ciudad: 'Manizales', responsable: 'Camila Vega', activo: true },
  { id: 'S-012', codigo: 'IBG-01', nombre: 'Sucursal Ibagué', ciudad: 'Ibagué', responsable: 'Felipe Ortiz', activo: false },
]

/**
 * Fetcher simulado (memoria local). Filtra por búsqueda y pagina.
 */
const createMockFetcher =
  (data: Sucursal[], delayMs = 350): AdminCatalogFetcher<Sucursal> =>
  async ({ page, pageSize, search }) => {
    await new Promise((r) => setTimeout(r, delayMs))
    const filtered = search
      ? data.filter((row) =>
          `${row.codigo} ${row.nombre} ${row.ciudad} ${row.responsable}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : data
    const start = (page - 1) * pageSize
    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  }

const meta = {
  title: '11-Templates/Admin Catalog Section',
  component: AdminCatalogSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**AdminCatalogSection** — Plantilla estandarizada para los CRUDs del módulo de Administración / Configuración / Catálogos.

Centraliza:
- Header estandarizado (eyebrow + título + descripción + icono + acciones)
- Buscador con debounce de 300ms
- Tabla con paginación configurable (\`perPageOptions\` + \`showJumpToPage\`)
- Estados: loading inicial, refreshing, error, empty

\`fetchPage\` es el único acoplamiento externo — recibe \`{ page, pageSize, search }\` y devuelve \`{ data, total, page, pageSize }\`.
        `,
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  argTypes: {
    eyebrow: { control: 'text', description: 'Etiqueta pequeña sobre el título' },
    title: { control: 'text', description: 'Título principal' },
    description: { control: 'text', description: 'Descripción breve bajo el título' },
    initialPageSize: {
      control: { type: 'select' },
      options: [5, 10, 25, 50],
      description: 'Tamaño de página inicial',
    },
    perPageOptions: {
      control: 'object',
      description: 'Opciones del selector "Por página"',
    },
    showJumpToPage: {
      control: 'boolean',
      description: 'Permite saltar a una página específica con input numérico',
    },
    paginationVariant: {
      control: { type: 'select' },
      options: ['dark', 'default', 'transparent'],
    },
    searchPlaceholder: { control: 'text' },
    emptyMessage: { control: 'text' },
  },
  args: {
    id: 'admin-catalog-demo',
    eyebrow: 'ADMINISTRACIÓN · SUCURSALES',
    title: 'Catálogo de Sucursales',
    description:
      'Administra las sucursales físicas donde opera el negocio. Define responsables y disponibilidad regional.',
    icon: <Layers className="h-5 w-5" />,
    initialPageSize: 5,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
    showJumpToPage: true,
    paginationVariant: 'dark',
    searchPlaceholder: 'Buscar por código, ciudad o responsable...',
    emptyMessage: 'No hay sucursales registradas para los filtros actuales.',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1.5rem', background: '#0b0d12', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminCatalogSection<Sucursal>>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Estado por defecto: con datos, paginación estándar, refresco.
 */
export const Default: Story = {
  args: {
    fetchPage: createMockFetcher(SAMPLE_DATA),
    renderTable: ({ data }) => (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#1c1d26', color: '#94a3b8', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px', fontSize: 11, letterSpacing: '0.18em' }}>CÓDIGO</th>
            <th style={{ padding: '12px 16px', fontSize: 11, letterSpacing: '0.18em' }}>NOMBRE</th>
            <th style={{ padding: '12px 16px', fontSize: 11, letterSpacing: '0.18em' }}>CIUDAD</th>
            <th style={{ padding: '12px 16px', fontSize: 11, letterSpacing: '0.18em' }}>RESPONSABLE</th>
            <th style={{ padding: '12px 16px', fontSize: 11, letterSpacing: '0.18em' }}>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700 }}>{row.codigo}</td>
              <td style={{ padding: '12px 16px' }}>{row.nombre}</td>
              <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{row.ciudad}</td>
              <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{row.responsable}</td>
              <td style={{ padding: '12px 16px' }}>
                <Badge variant={row.activo ? 'success' : 'neutral'}>
                  {row.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
}

/**
 * Vista con `headerActions`: botón "Nueva Sucursal".
 */
export const WithHeaderActions: Story = {
  args: {
    ...Default.args,
    headerActions: (
      <>
        <Button variant="secondary" icon={<Settings className="h-4 w-4" />}>
          Configurar
        </Button>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Nueva Sucursal
        </Button>
      </>
    ),
  },
}

/**
 * Estado de error en la carga.
 */
export const WithError: Story = {
  args: {
    ...Default.args,
    fetchPage: async () => {
      await new Promise((r) => setTimeout(r, 400))
      throw new Error('No se pudo conectar con el servicio de sucursales (HTTP 503).')
    },
  },
}

/**
 * Estado vacío (sin resultados).
 */
export const Empty: Story = {
  args: {
    ...Default.args,
    fetchPage: createMockFetcher([]),
  },
}

/**
 * Conjunto pequeño con `perPageOptions` reducidas.
 */
export const SmallPerPageOptions: Story = {
  args: {
    ...Default.args,
    initialPageSize: 3,
    perPageOptions: [3, 10, 25],
  },
}

/**
 * Versión clara (light mode) con paginación `default`.
 */
export const LightVariant: Story = {
  parameters: { theme: 'light' },
  args: {
    ...Default.args,
    paginationVariant: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1.5rem', background: '#f1f5f9', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * Vista con filtro personalizado en el slot `renderFilters`.
 */
export const WithCustomFilter: Story = {
  args: {
    ...Default.args,
    title: 'Catálogo de Usuarios',
    eyebrow: 'ADMINISTRACIÓN · USUARIOS',
    icon: <Users className="h-5 w-5" />,
    description: 'Filtra por rol para acotar la búsqueda en catálogos grandes.',
    renderFilters: ({ search, onSearchChange }) => (
      <>
        <input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            background: '#1c1d26',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <select
          style={{
            background: '#1c1d26',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <option>Todos los roles</option>
          <option>Administrador</option>
          <option>Operario</option>
          <option>Cajero</option>
        </select>
      </>
    ),
  },
}

/**
 * Vista mobile (375px) — útil para validar responsiveness.
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  args: Default.args,
}

/**
 * Vista tablet (iPad 768px).
 */
export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
  args: Default.args,
}

/**
 * Vista laptop (1280px).
 */
export const Laptop: Story = {
  parameters: { viewport: { defaultViewport: 'laptop' } },
  args: Default.args,
}

/**
 * Vista desktop grande (1440px).
 */
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
  args: Default.args,
}