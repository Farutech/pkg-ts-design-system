import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

/**
 * DataTable — tabla profesional con orden, paginación, selección y acciones.
 *
 * Usa @tanstack/react-table internamente. Soporta columnas ordenables,
 * paginación, selección múltiple, búsqueda global, filtros y acciones por fila.
 */
const MOCK_DATA = [
  { id: 'USR-001', name: 'Ana García', email: 'ana@empresa.com', role: 'Administradora', status: 'active' },
  { id: 'USR-002', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Editor', status: 'active' },
  { id: 'USR-003', name: 'María Torres', email: 'maria@empresa.com', role: 'Vista', status: 'pending' },
  { id: 'USR-004', name: 'Pedro Sánchez', email: 'pedro@empresa.com', role: 'Editor', status: 'active' },
  { id: 'USR-005', name: 'Laura Martínez', email: 'laura@empresa.com', role: 'Administradora', status: 'inactive' },
  { id: 'USR-006', name: 'Diego Ramírez', email: 'diego@empresa.com', role: 'Vista', status: 'active' },
  { id: 'USR-007', name: 'Sofía Herrera', email: 'sofia@empresa.com', role: 'Editor', status: 'pending' },
  { id: 'USR-008', name: 'Tomás Ruiz', email: 'tomas@empresa.com', role: 'Vista', status: 'active' },
  { id: 'USR-009', name: 'Valentina Díaz', email: 'valen@empresa.com', role: 'Administradora', status: 'active' },
  { id: 'USR-010', name: 'Sebastián Romero', email: 'sebas@empresa.com', role: 'Editor', status: 'inactive' },
]

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  active: 'success', pending: 'warning', inactive: 'danger',
}

const COLUMNS: ColumnDef<(typeof MOCK_DATA)[number]>[] = [
  { accessorKey: 'id', header: 'ID', cell: info => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{String(info.getValue())}</span> },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Correo', cell: info => <span style={{ color: 'var(--ft-color-muted-foreground)', fontSize: '0.8125rem' }}>{String(info.getValue())}</span> },
  { accessorKey: 'role', header: 'Rol' },
  { accessorKey: 'status', header: 'Estado', cell: info => (
    <Badge variant={STATUS_VARIANT[info.getValue() as string] || 'default'}>{String(info.getValue())}</Badge>
  )},
  { accessorKey: 'id', header: 'Acciones', cell: () => (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      <Button variant="ghost" size="sm">Editar</Button>
      <Button variant="ghost" size="sm">Ver</Button>
    </div>
  ), enableSorting: false },
]

const meta = {
  title: '5-Data Display/DataTable',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabla profesional con ordenamiento, paginación, selección, búsqueda y acciones usando @tanstack/react-table.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TablaCompleta: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
    const [page, setPage] = useState(1)

    return (
      <div style={{ width: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--ft-color-border)', background: 'var(--ft-color-surface)', color: 'var(--ft-color-foreground)', width: '240px', outline: 'none' }}
            />
            {selectedRows.size > 0 && <Badge variant="primary">{selectedRows.size} seleccionado(s)</Badge>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" size="sm">Exportar</Button>
            <Button size="sm">Nuevo usuario</Button>
          </div>
        </div>

        <DataTable
          data={MOCK_DATA}
          columns={COLUMNS}
          searchable
          searchValue={search}
          onSearch={setSearch}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          actions={{
            onEdit: (row) => alert(`Editar ${row.name}`),
            onView: (row) => alert(`Ver ${row.name}`),
            onDuplicate: (row) => alert(`Duplicar ${row.name}`),
          }}
          pagination={{
            page,
            perPage: 5,
            total: MOCK_DATA.length,
            onPageChange: setPage,
          }}
        />
      </div>
    )
  },
}
