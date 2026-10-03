import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { CRUDPage } from '@/components/crud/CRUDPage'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'

interface MockItem {
  id: number
  name: string
  role: string
  status: string
}

const mockColumns: ColumnDef<MockItem, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'role', header: 'Rol' },
  { accessorKey: 'status', header: 'Estado' },
]

const sampleData: MockItem[] = [
  { id: 1, name: 'Ana García', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Carlos Ruiz', role: 'Editor', status: 'Inactivo' },
  { id: 3, name: 'Elena Torres', role: 'Visualizador', status: 'Activo' },
]

describe('DataTable: Enterprise Virtualization, Density & Selection', () => {
  it('renders data rows in standard mode when virtualized={false}', () => {
    render(<DataTable data={sampleData} columns={mockColumns} virtualized={false} />)

    expect(screen.getAllByText('Ana García')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Carlos Ruiz')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Elena Torres')[0]).toBeInTheDocument()
  })

  it('renders with density styling (compact / dense / comfortable)', () => {
    const { container } = render(
      <DataTable data={sampleData} columns={mockColumns} density="dense" showDensitySwitcher />
    )

    const tableWrapper = container.querySelector('[data-density="dense"]')
    expect(tableWrapper).toBeInTheDocument()

    // Switcher buttons should exist
    expect(screen.getByText('Densa')).toBeInTheDocument()
    expect(screen.getByText('Cómoda')).toBeInTheDocument()
  })

  it('toggles column visibility when showColumnVisibility={true}', async () => {
    render(<DataTable data={sampleData} columns={mockColumns} showColumnVisibility />)

    const colButton = screen.getByTitle('Visibilidad de columnas')
    fireEvent.click(colButton)

    // Check dropdown options
    expect(screen.getByText('Mostrar columnas')).toBeInTheDocument()
    const nameCheckbox = screen.getByRole('checkbox', { name: /Nombre/i })
    expect(nameCheckbox).toBeChecked()

    // Uncheck Nombre column
    fireEvent.click(nameCheckbox)

    // Column header for Nombre should disappear or be hidden
    await waitFor(() => {
      expect(nameCheckbox).not.toBeChecked()
    })
  })

  it('activates BulkActionsBar when selectable and rows are selected', () => {
    const onSelectionChange = vi.fn()
    const { rerender } = render(
      <DataTable
        data={sampleData}
        columns={mockColumns}
        selectable
        selectedRows={new Set([1, 2])}
        onSelectionChange={onSelectionChange}
        bulkActions={[
          { id: 'export', label: 'Exportar lote', onClick: vi.fn() },
        ]}
      />
    )

    expect(screen.getByText('2 seleccionados')).toBeInTheDocument()
    expect(screen.getByText('Exportar lote')).toBeInTheDocument()
  })

  it('auto-virtualizes when data exceeds tableThreshold', () => {
    // Generate 150 items
    const largeData: MockItem[] = Array.from({ length: 120 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: 'Staff',
      status: 'Active',
    }))

    const { container } = render(
      <DesignSystemProvider virtualization={{ tableThreshold: 100 }}>
        <DataTable data={largeData} columns={mockColumns} />
      </DesignSystemProvider>
    )

    const virtualWrapper = container.querySelector('[data-virtualized="true"]')
    expect(virtualWrapper).toBeInTheDocument()
  })

  it('disables virtualization with escape hatch virtualized={false} even if > 100 rows', () => {
    const largeData: MockItem[] = Array.from({ length: 120 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: 'Staff',
      status: 'Active',
    }))

    const { container } = render(
      <DataTable data={largeData} columns={mockColumns} virtualized={false} />
    )

    const nonVirtualWrapper = container.querySelector('[data-virtualized="false"]')
    expect(nonVirtualWrapper).toBeInTheDocument()
  })
})

describe('CRUDPage: Enterprise Slots & Bulk Operations', () => {
  it('renders default CRUD layout with title and actions', () => {
    render(
      <CRUDPage
        title="Gestión de Usuarios"
        description="Administración de cuentas activas"
        data={sampleData}
        columns={mockColumns}
      />
    )

    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Administración de cuentas activas')).toBeInTheDocument()
    expect(screen.getByText('Crear nuevo')).toBeInTheDocument()
  })

  it('supports custom headerSlot, toolbarSlot, and filtersSlot', () => {
    render(
      <CRUDPage
        title="Usuarios"
        data={sampleData}
        columns={mockColumns}
        headerSlot={<div data-testid="custom-header">Mi Cabecera Personalizada</div>}
        filtersSlot={<div data-testid="custom-filters">Filtros Avanzados</div>}
      />
    )

    expect(screen.getByTestId('custom-header')).toHaveTextContent('Mi Cabecera Personalizada')
    expect(screen.getByTestId('custom-filters')).toHaveTextContent('Filtros Avanzados')
  })

  it('supports custom tableSlot replacement', () => {
    render(
      <CRUDPage
        title="Usuarios"
        data={sampleData}
        columns={mockColumns}
        tableSlot={<div data-testid="custom-table">Tabla Custom</div>}
      />
    )

    expect(screen.getByTestId('custom-table')).toHaveTextContent('Tabla Custom')
  })

  it('supports custom bulkActionsSlot with render props', () => {
    render(
      <CRUDPage
        title="Usuarios"
        data={sampleData}
        columns={mockColumns}
        selectedRows={new Set([1, 2, 3])}
        bulkActionsSlot={({ selectedRows, clearSelection }) => (
          <div data-testid="custom-bulk">
            <span>Seleccionados: {selectedRows.size}</span>
            <button onClick={clearSelection}>Limpiar</button>
          </div>
        )}
      />
    )

    expect(screen.getByTestId('custom-bulk')).toHaveTextContent('Seleccionados: 3')
  })

  it('opens and cancels modal for creating a new record', async () => {
    render(
      <CRUDPage
        title="Usuarios"
        data={sampleData}
        columns={mockColumns}
        fields={[
          { key: 'name', label: 'Nombre', required: true },
          { key: 'role', label: 'Rol' },
        ]}
      />
    )

    const createBtn = screen.getByText('Crear nuevo')
    fireEvent.click(createBtn)

    expect(screen.getByText('Crear nuevo registro en Usuarios')).toBeInTheDocument()
    const cancelBtn = screen.getByText('Cancelar')
    fireEvent.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByText('Crear nuevo registro en Usuarios')).not.toBeInTheDocument()
    })
  })
})
