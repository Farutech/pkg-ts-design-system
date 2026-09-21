import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/Badge'

/**
 * CRUDPage — página de gestión de usuarios con toolbar, DataTable, Drawer edición y Modal borrado.
 */

type CrudUser = {
  id: string
  name: string
  email: string
  role: string
  status: string
  department: string
}

const meta = {
  title: '11-Templates/CRUD Page',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

export const Default: StoryObj<typeof meta> = {}

const _CRUD_DATA: CrudUser[] = [
  { id: 'USR-001', name: 'Ana García', email: 'ana@empresa.com', role: 'Administradora', status: 'active', department: 'Tecnología' },
  { id: 'USR-002', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Editor', status: 'active', department: 'Marketing' },
  { id: 'USR-003', name: 'María Torres', email: 'maria@empresa.com', role: 'Vista', status: 'pending', department: 'Ventas' },
  { id: 'USR-004', name: 'Pedro Sánchez', email: 'pedro@empresa.com', role: 'Editor', status: 'active', department: 'Tecnología' },
  { id: 'USR-005', name: 'Laura Martínez', email: 'laura@empresa.com', role: 'Administradora', status: 'inactive', department: 'RRHH' },
  { id: 'USR-006', name: 'Diego Ramírez', email: 'diego@empresa.com', role: 'Vista', status: 'active', department: 'Operaciones' },
  { id: 'USR-007', name: 'Sofía Herrera', email: 'sofia@empresa.com', role: 'Editor', status: 'pending', department: 'Marketing' },
  { id: 'USR-008', name: 'Tomás Ruiz', email: 'tomas@empresa.com', role: 'Vista', status: 'active', department: 'Ventas' },
  { id: 'USR-009', name: 'Valentina Díaz', email: 'valen@empresa.com', role: 'Administradora', status: 'active', department: 'Tecnología' },
  { id: 'USR-010', name: 'Sebastián Romero', email: 'sebas@empresa.com', role: 'Editor', status: 'inactive', department: 'RRHH' },
]

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  active: 'success', pending: 'warning', inactive: 'danger',
}

const _COLUMNS_NO_ACTIONS: ColumnDef<CrudUser>[] = [
  { accessorKey: 'id', header: 'ID', cell: info => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{String(info.getValue())}</span> },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Correo', cell: info => <span style={{ color: 'var(--ft-color-muted-foreground)', fontSize: '0.8125rem' }}>{String(info.getValue())}</span> },
  { accessorKey: 'role', header: 'Rol' },
  { accessorKey: 'department', header: 'Departamento' },
  { accessorKey: 'status', header: 'Estado', cell: info => <Badge variant={STATUS_VARIANT[info.getValue() as string] || 'default'}>{String(info.getValue())}</Badge> },
]
