import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from '@/components/ui/Table'

/**
 * Table — tabla presentacional simple sin orden ni paginación.
 *
 * Equivalente a la `.table` de Bootstrap. Para tablas con orden/paginación
 * usar DataTable o CRUDTable.
 */
const COLUMNS = [
  { key: 'name', header: 'Producto', align: 'left' },
  { key: 'category', header: 'Categoría', align: 'left' },
  { key: 'price', header: 'Precio', align: 'right' },
  { key: 'stock', header: 'Stock', align: 'center' },
  { key: 'status', header: 'Estado', align: 'center' },
]

const ROWS = [
  { id: '1', cells: { name: 'MacBook Pro 14"', category: 'Laptops', price: '$1.999.000', stock: '12', status: 'Disponible' } },
  { id: '2', cells: { name: 'iPhone 15 Pro', category: 'Smartphones', price: '$1.799.000', stock: '28', status: 'Disponible' } },
  { id: '3', cells: { name: 'AirPods Pro 2', category: 'Audio', price: '$499.000', stock: '0', status: 'Agotado' } },
  { id: '4', cells: { name: 'iPad Air M2', category: 'Tablets', price: '$1.199.000', stock: '7', status: 'Bajo stock' } },
  { id: '5', cells: { name: 'Apple Watch Ultra', category: 'Wearables', price: '$1.499.000', stock: '4', status: 'Disponible' } },
]

const meta = {
  title: '5-Data Display/Table',
  component: Table,
  argTypes: {
    variant: { control: 'radio', options: ['default', 'striped', 'bordered'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    headerVariant: { control: 'radio', options: ['light', 'dark'] },
  },
  args: {
    columns: COLUMNS,
    rows: ROWS,
    variant: 'default',
    size: 'md',
    headerVariant: 'light',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabla presentacional (`.table` de Bootstrap). Soporta variantes striped, bordered, tamaños y header dark.',
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Striped: Story = {
  args: { variant: 'striped' },
}

export const Bordered: Story = {
  args: { variant: 'bordered' },
}

export const HeaderDark: Story = {
  name: 'Header oscuro',
  args: { headerVariant: 'dark' },
}

export const ConEmptyState: Story = {
  name: 'Sin datos (empty state)',
  args: {
    columns: COLUMNS,
    rows: [],
    headerVariant: 'dark',
    emptyState: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
        <svg className="h-8 w-8 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
        No hay productos en la base de datos
      </div>
    ),
  },
}
