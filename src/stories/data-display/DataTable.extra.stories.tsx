import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'

const meta = {
  title: 'Data Display/DataTable/Extra',
  component: DataTable,
} satisfies Meta<typeof DataTable>

export default meta

/**
 * DataTable — secundarios: sin acciones, loading, empty state.
 */

const MOCK_DATA = [
  { id: '1', name: 'Ana García', email: 'ana@empresa.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'María Torres', email: 'maria@empresa.com', role: 'Vista', status: 'pending' },
]

type MockUser = (typeof MOCK_DATA)[number]

const SIMPLE_COLUMNS: ColumnDef<MockUser>[] = [
  { accessorKey: 'id', header: 'ID', cell: info => <span style={{ fontFamily: 'monospace' }}>{String(info.getValue())}</span> },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Correo', cell: info => <span style={{ color: 'var(--ft-color-muted-foreground)' }}>{String(info.getValue())}</span> },
  { accessorKey: 'role', header: 'Rol' },
  { accessorKey: 'status', header: 'Estado', cell: info => <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">{String(info.getValue())}</span> },
]

export const SinAcciones: StoryObj<typeof meta> = {
  args: {
    data: MOCK_DATA,
    columns: SIMPLE_COLUMNS as ColumnDef<{ id: string | number }, any>[],
  },
  render: () => (
    <div style={{ width: '700px' }}>
      <DataTable data={MOCK_DATA} columns={SIMPLE_COLUMNS} />
    </div>
  ),
}

export const ConLoading: StoryObj<typeof meta> = {
  name: 'Estado de loading',
  args: {
    data: [],
    columns: SIMPLE_COLUMNS as ColumnDef<{ id: string | number }, any>[],
    isLoading: true,
    emptyMessage: 'Cargando usuarios...',
  },
  render: () => (
    <div style={{ width: '700px' }}>
      <DataTable data={[]} columns={SIMPLE_COLUMNS} isLoading emptyMessage="Cargando usuarios..." />
    </div>
  ),
}

export const SinDatos: StoryObj<typeof meta> = {
  name: 'Sin datos (empty state)',
  args: {
    data: [],
    columns: SIMPLE_COLUMNS as ColumnDef<{ id: string | number }, any>[],
    emptyMessage: 'No hay usuarios registrados',
  },
  render: () => (
    <div style={{ width: '700px' }}>
      <DataTable
        data={[]}
        columns={SIMPLE_COLUMNS}
        emptyMessage="No hay usuarios registrados"
        emptyIcon={<svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
      />
    </div>
  ),
}
