import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/auth-screens/LoginPage'
import { CRUDPage } from '@/components/crud/CRUDPage'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/primitives/Icon/Icon'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'

const meta: Meta = {
  title: '11-Templates/EnterprisePatterns',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Patrones compuestos de nivel empresarial de FaruTech Design System: AppShell responsivo con rail/drawer, LoginPage con sidePanel y providers, y CRUDPage con arquitectura de slots nombrados y acciones masivas.',
      },
    },
  },
}

export default meta

// ----------------------------------------------------------------------------
// 1. AppShell Enterprise Pattern
// ----------------------------------------------------------------------------
export const AppShellPattern: StoryObj = {
  render: () => {
    const navItems = [
      { id: 'dash', label: 'Dashboard', href: '#dash', icon: <Icon.Search className="w-5 h-5" />, active: true },
      { id: 'ops', label: 'Operaciones', href: '#ops', icon: <Icon.ChevronRight className="w-5 h-5" />, badge: '12' },
      { id: 'clients', label: 'Clientes', href: '#clients', icon: <Icon.ChevronRight className="w-5 h-5" /> },
      { id: 'settings', label: 'Configuración', href: '#settings', icon: <Icon.ChevronRight className="w-5 h-5" /> },
    ]

    return (
      <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <AppShell
          appName="Afilamos Operaciones"
          logo={<span className="font-black text-primary-600 text-lg">⚡ FaruTech</span>}
          navigation={navItems}
          breadcrumbs={[
            { label: 'Inicio', href: '/' },
            { label: 'Operaciones', href: '/ops' },
            { label: 'Lotes Activos' },
          ]}
          user={{
            name: 'Farid Arango',
            email: 'farid@farutech.com',
            role: 'Superadmin',
          }}
          navbarActions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                Documentación
              </Button>
              <Button size="sm" variant="primary">
                Nueva Orden
              </Button>
            </div>
          }
          footer={
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>© 2026 FaruTech Inc. Todos los derechos reservados.</span>
              <span className="font-mono">v1.0.1 (Enterprise Edition)</span>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Bienvenido al Panel de Control
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta vista está montada dentro del layout <code>AppShell</code> con navegación colapsable, drawer móvil y slots nombrados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Órdenes Activas: 48', 'Rendimiento: 99.4%', 'Incidentes: 0'].map((metric, i) => (
                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
                  <div className="text-sm text-gray-500">Métrica clave</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">{metric}</div>
                </div>
              ))}
            </div>
          </div>
        </AppShell>
      </div>
    )
  },
}

// ----------------------------------------------------------------------------
// 2. LoginPage Enterprise Pattern
// ----------------------------------------------------------------------------
export const LoginPagePattern: StoryObj = {
  render: () => {
    return (
      <div className="h-[750px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <LoginPage
          title="Iniciar Sesión"
          subtitle="Accede a tu plataforma empresarial FaruTech"
          onSubmit={async (creds) => {
            alert(`Iniciando sesión con email: ${creds.email}`)
          }}
          providers={[
            {
              id: 'google',
              name: 'Google Workspace',
              onClick: () => alert('Login con Google Workspace'),
            },
            {
              id: 'microsoft',
              name: 'Microsoft Azure AD',
              onClick: () => alert('Login con Microsoft Entra ID'),
            },
          ]}
          sidePanelTitle="Seguridad y Control Unificado"
          sidePanelDescription="Monitoreo de auditoría, control de acceso basado en roles (RBAC) y cumplimiento continuo en una sola infraestructura."
          sidePanelBadge="ISO 27001 Certified"
        />
      </div>
    )
  },
}

// ----------------------------------------------------------------------------
// 3. CRUDPage with Named Slots Pattern
// ----------------------------------------------------------------------------
interface InventoryItem {
  id: number
  code: string
  name: string
  stock: number
  category: string
  status: 'Disponible' | 'Bajo Stock' | 'Agotado'
}

const mockInventory: InventoryItem[] = [
  { id: 101, code: 'SKU-001', name: 'Disco Sierra Circular 12"', stock: 45, category: 'Discos', status: 'Disponible' },
  { id: 102, code: 'SKU-002', name: 'Fresa Metal Duro 4 Labios', stock: 6, category: 'Fresas', status: 'Bajo Stock' },
  { id: 103, code: 'SKU-003', name: 'Cuchilla Cepilladora HSS', stock: 0, category: 'Cuchillas', status: 'Agotado' },
  { id: 104, code: 'SKU-004', name: 'Broca Forstner 35mm', stock: 89, category: 'Brocas', status: 'Disponible' },
  { id: 105, code: 'SKU-005', name: 'Cabezal Ranurador 150mm', stock: 2, category: 'Cabezales', status: 'Bajo Stock' },
]

export const CRUDPageSlotsPattern: StoryObj = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set([102]))

    const columns = [
      { accessorKey: 'code', header: 'Código SKU' },
      { accessorKey: 'name', header: 'Nombre del Producto' },
      { accessorKey: 'category', header: 'Categoría' },
      { accessorKey: 'stock', header: 'Existencias' },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: (info: any) => {
          const val = info.getValue()
          const variant = val === 'Disponible' ? 'success' : val === 'Bajo Stock' ? 'warning' : 'danger'
          return <Badge variant={variant as any}>{val}</Badge>
        },
      },
    ]

    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-[700px]">
        <CRUDPage
          title="Gestión de Inventario Industrial"
          description="Monitoreo de existencias con virtualización matemática y acciones masivas"
          data={mockInventory}
          columns={columns}
          selectable
          selectedRows={selectedItems}
          onSelectionChange={setSelectedItems}
          showDensitySwitcher
          showColumnVisibility
          toolbarSlot={
            <Button size="sm" variant="outline" onClick={() => alert('Sincronizando con ERP')}>
              Sincronizar ERP
            </Button>
          }
          bulkActionsSlot={({ selectedRows, clearSelection }) => (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-800 animate-in fade-in">
              <span className="font-bold text-sm bg-primary-600 px-2 py-0.5 rounded-full">
                {selectedRows.size}
              </span>
              <span className="text-sm font-medium">ítems de inventario seleccionados</span>
              <div className="h-4 w-px bg-gray-700 mx-2" />
              <Button size="sm" variant="secondary" onClick={() => alert(`Exportando ${selectedRows.size} ítems`)}>
                Exportar Lote
              </Button>
              <Button size="sm" variant="danger" onClick={() => alert(`Ajustando stock de ${selectedRows.size} ítems`)}>
                Ajustar Stock
              </Button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-white underline ml-2"
              >
                Deseleccionar
              </button>
            </div>
          )}
        />
      </div>
    )
  },
}
