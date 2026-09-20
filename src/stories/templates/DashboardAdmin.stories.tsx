import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Timeline } from '@/components/ui/Timeline'
import { Charts } from '@/components/ui/Charts'
import {
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

/**
 * Dashboard Admin — Template completo de panel de administración.
 *
 * Incluye:
 * - Sidebar vertical con módulos y categorías multinivel (colapsable)
 * - Topbar con búsqueda, notificaciones y perfil de usuario
 * - Grid de StatsCards (KPIs)
 * - Gráfico de línea de ingresos
 * - Tabla de transacciones recientes
 * - Widget de actividad reciente (Timeline)
 */

const SIDEBAR_MENU = [
  { id: 'dashboard', icon: HomeIcon, label: 'Dashboard', active: true },
  {
    id: 'ventas', icon: ShoppingCartIcon, label: 'Ventas', badge: 12,
    children: [
      { id: 'ventas-ordenes', label: 'Órdenes' },
      { id: 'ventas-facturas', label: 'Facturación' },
      { id: 'ventas-reportes', label: 'Reportes' },
    ],
  },
  {
    id: 'crm', icon: BuildingOfficeIcon, label: 'CRM',
    children: [
      { id: 'crm-clientes', label: 'Clientes' },
      { id: 'crm-leads', label: 'Leads', badge: 5 },
      { id: 'crm-contactos', label: 'Contactos' },
    ],
  },
  { id: 'usuarios', icon: UsersIcon, label: 'Usuarios', badge: 3 },
  { id: 'reportes', icon: ChartBarIcon, label: 'Reportes' },
  { id: 'documentos', icon: DocumentTextIcon, label: 'Documentos' },
]

const TRANSACTIONS = [
  { id: 'TRX-001', client: 'García & Asociados', amount: '$4,250', status: 'success', date: 'Hoy, 10:45' },
  { id: 'TRX-002', client: 'Industrias Roca SA', amount: '$12,800', status: 'warning', date: 'Hoy, 09:30' },
  { id: 'TRX-003', client: 'Comercial Norte', amount: '$890', status: 'success', date: 'Ayer, 16:20' },
  { id: 'TRX-004', client: 'Tech Solutions Ltda', amount: '$7,450', status: 'danger', date: 'Ayer, 14:10' },
  { id: 'TRX-005', client: 'Distribuidora Sur', amount: '$3,200', status: 'success', date: 'Ayer, 11:55' },
]

const STATUS_LABEL: Record<string, string> = {
  success: 'Pagado',
  warning: 'Pendiente',
  danger: 'Rechazado',
}

const LINE_DATA = [
  { month: 'Ene', ingresos: 65000, gastos: 42000 },
  { month: 'Feb', ingresos: 78000, gastos: 45000 },
  { month: 'Mar', ingresos: 71000, gastos: 40000 },
  { month: 'Abr', ingresos: 95000, gastos: 52000 },
  { month: 'May', ingresos: 88000, gastos: 48000 },
  { month: 'Jun', ingresos: 112000, gastos: 58000 },
  { month: 'Jul', ingresos: 98000, gastos: 51000 },
  { month: 'Ago', ingresos: 125000, gastos: 63000 },
  { month: 'Sep', ingresos: 142000, gastos: 70000 },
  { month: 'Oct', ingresos: 138000, gastos: 68000 },
  { month: 'Nov', ingresos: 156000, gastos: 75000 },
  { month: 'Dic', ingresos: 184000, gastos: 88000 },
]

const TIMELINE_ITEMS = [
  { id: '1', title: 'Pedido #TRX-001 aprobado', description: 'García & Asociados · $4,250', time: 'Hace 15 min', status: 'success' as const },
  { id: '2', title: 'Nuevo cliente registrado', description: 'María García se unió al sistema', time: 'Hace 45 min', status: 'info' as const },
  { id: '3', title: 'Pago rechazado', description: 'Tech Solutions Ltda · $7,450', time: 'Hace 2 h', status: 'error' as const },
  { id: '4', title: 'Reporte generado', description: 'Informe mensual de noviembre listo', time: 'Hace 4 h', status: 'default' as const },
]

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('ventas')
  const [darkMode, setDarkMode] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: 'var(--ft-font-sans)',
      background: 'var(--ft-color-background)',
      color: 'var(--ft-color-foreground)',
    }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '64px',
        flexShrink: 0,
        background: 'var(--ft-color-surface)',
        borderRight: '1px solid var(--ft-color-border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          height: '56px', display: 'flex', alignItems: 'center',
          padding: '0 1rem', gap: '0.75rem',
          borderBottom: '1px solid var(--ft-color-border)', flexShrink: 0,
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--ft-color-primary), var(--ft-color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.875rem',
          }}>F</div>
          {sidebarOpen && (
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              FaruTech ERP
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem' }}>
          {SIDEBAR_MENU.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedMenu === item.id
            return (
              <div key={item.id}>
                <button
                  onClick={() => hasChildren ? setExpandedMenu(isExpanded ? null : item.id) : undefined}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.5rem 0.625rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                    background: item.active ? 'var(--ft-color-primary)' : 'transparent',
                    color: item.active ? 'white' : 'var(--ft-color-muted-foreground)',
                    fontSize: '0.875rem', fontWeight: item.active ? 600 : 400,
                    transition: 'all 0.15s', marginBottom: '2px',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: item.active ? 'rgba(255,255,255,0.3)' : 'var(--ft-color-danger)',
                          color: 'white', borderRadius: '9999px', fontSize: '0.65rem',
                          fontWeight: 700, padding: '0 6px', minWidth: '18px', textAlign: 'center',
                        }}>{item.badge}</span>
                      )}
                      {hasChildren && <ChevronRightIcon style={{ width: '14px', height: '14px', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />}
                    </>
                  )}
                </button>
                {hasChildren && isExpanded && sidebarOpen && (
                  <div style={{ paddingLeft: '2.25rem', marginBottom: '4px' }}>
                    {item.children!.map((child) => (
                      <button key={child.id} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.375rem 0.625rem', borderRadius: '0.375rem', border: 'none',
                        background: 'transparent', color: 'var(--ft-color-muted-foreground)',
                        fontSize: '0.8125rem', cursor: 'pointer', textAlign: 'left',
                        marginBottom: '1px',
                      }}>
                        <span>{child.label}</span>
                        {child.badge && (
                          <span style={{ background: 'var(--ft-color-danger)', color: 'white', borderRadius: '9999px', fontSize: '0.6rem', padding: '0 5px', fontWeight: 700 }}>{child.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        {sidebarOpen && (
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--ft-color-border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Avatar name="Admin User" size="sm" status="online" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>Admin User</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)' }}>admin@farutech.com</p>
            </div>
            <ArrowRightOnRectangleIcon style={{ width: '16px', height: '16px', color: 'var(--ft-color-muted-foreground)', cursor: 'pointer', flexShrink: 0 }} />
          </div>
        )}
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 1.5rem',
          background: 'var(--ft-color-surface)',
          borderBottom: '1px solid var(--ft-color-border)',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--ft-color-muted-foreground)', borderRadius: '6px' }}>
              <Bars3Icon style={{ width: '20px', height: '20px' }} />
            </button>
            <nav style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Inicio</span>
              <ChevronRightIcon style={{ width: '12px', height: '12px' }} />
              <span style={{ color: 'var(--ft-color-foreground)', fontWeight: 500 }}>Dashboard</span>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.75rem', borderRadius: '9999px',
              background: 'var(--ft-color-background)', border: '1px solid var(--ft-color-border)',
              fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', cursor: 'pointer',
            }}>
              <MagnifyingGlassIcon style={{ width: '14px', height: '14px' }} />
              <span>Buscar...</span>
              <kbd style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>⌘K</kbd>
            </div>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--ft-color-muted-foreground)', borderRadius: '8px' }}>
              {darkMode ? <SunIcon style={{ width: '18px', height: '18px' }} /> : <MoonIcon style={{ width: '18px', height: '18px' }} />}
            </button>

            {/* Notifications */}
            <button onClick={() => setNotifOpen(!notifOpen)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--ft-color-muted-foreground)', borderRadius: '8px' }}>
              <BellIcon style={{ width: '18px', height: '18px' }} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ft-color-danger)', border: '2px solid var(--ft-color-surface)' }} />
            </button>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Avatar name="Admin User" size="sm" status="online" />
              <ChevronDownIcon style={{ width: '14px', height: '14px', color: 'var(--ft-color-muted-foreground)' }} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--ft-color-foreground)' }}>
                Panel de control
              </h1>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
                Bienvenido, Admin. Aquí tienes un resumen del día.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="outline" size="sm" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>Exportar</Button>
              <Button size="sm" icon={<PlusIcon className="h-4 w-4" />}>Nueva orden</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <StatsCard title="Ingresos del mes" value="$184,290" icon={<CurrencyDollarIcon className="h-6 w-6" />} variant="success" change={{ value: 18.2, trend: 'up', label: 'vs noviembre' }} />
            <StatsCard title="Órdenes activas" value="1,847" icon={<ShoppingCartIcon className="h-6 w-6" />} variant="primary" change={{ value: 7.4, trend: 'up', label: 'esta semana' }} />
            <StatsCard title="Usuarios activos" value="12,456" icon={<UsersIcon className="h-6 w-6" />} variant="info" change={{ value: 3.1, trend: 'up', label: 'este mes' }} />
            <StatsCard title="Tasa de conversión" value="3.24%" icon={<ChartBarIcon className="h-6 w-6" />} variant="warning" change={{ value: 0.8, trend: 'down', label: 'vs semana pasada' }} />
          </div>

          {/* Chart + Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem' }}>
            {/* Chart */}
            <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>Ingresos vs Gastos</h2>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>Evolución anual 2024</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Badge variant="primary" dot>Ingresos</Badge>
                  <Badge variant="danger" dot>Gastos</Badge>
                </div>
              </div>
              <Charts
                type="line"
                data={LINE_DATA}
                lines={[
                  { key: 'ingresos', name: 'Ingresos', color: '#2563eb' },
                  { key: 'gastos', name: 'Gastos', color: '#dc2626' },
                ]}
                xKey="month"
                height={240}
              />
            </div>

            {/* Timeline */}
            <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>Actividad reciente</h2>
                <Button variant="ghost" size="sm">Ver todo</Button>
              </div>
              <Timeline items={TIMELINE_ITEMS} />
            </div>
          </div>

          {/* Transactions table */}
          <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>Transacciones recientes</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="ghost" size="sm" icon={<FunnelIcon className="h-4 w-4" />}>Filtrar</Button>
                <Button variant="outline" size="sm">Ver todas</Button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ft-color-border)' }}>
                  {['ID', 'Cliente', 'Monto', 'Estado', 'Fecha'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--ft-color-border)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>{tx.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--ft-color-foreground)' }}>{tx.client}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>{tx.amount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <Badge variant={tx.status as 'success' | 'warning' | 'danger'}>{STATUS_LABEL[tx.status]}</Badge>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--ft-color-muted-foreground)', fontSize: '0.8125rem' }}>{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

const meta = {
  title: '11-Templates/Dashboard Admin',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Template completo de panel de administración empresarial.
Incluye:
- Sidebar colapsable con navegación multinivel (categorías expandibles)
- Topbar con búsqueda, dark mode, notificaciones y avatar
- Grid de 4 StatsCards KPI con tendencias
- Gráfico de línea de ingresos vs gastos (recharts)
- Widget de actividad reciente (Timeline)
- Tabla de transacciones con badges de estado`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AdminPanel: Story = {
  name: 'Panel de administración',
  render: () => <AdminDashboard />,
}
