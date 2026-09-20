import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from '@/components/ui/Timeline'
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

/**
 * Timeline — lista vertical de eventos con nodos coloreados.
 *
 * Soporta iconos personalizados, colores de nodo (primary, success, warning,
 * danger, gray) y timestamp. Ideal para actividad de usuarios, historial de
 * acciones o logs de sistema.
 */
const ACTIVITY_ITEMS = [
  { title: 'Nuevo usuario registrado', description: 'Ana García creó una cuenta con email ana@empresa.com', time: 'Hace 5 minutos', color: 'success', icon: UserGroupIcon },
  { title: 'Orden de compra creada', description: 'Orden #TRX-0421 por $890.000 COP', time: 'Hace 25 minutos', color: 'primary', icon: BuildingOfficeIcon },
  { title: 'Pago pendiente de verificación', description: 'Pago de $1.200.000 COP requiere revisión manual', time: 'Hace 1 hora', color: 'warning' },
  { title: 'Error en proceso de exportación', description: 'Fallo al exportar reporte de ventas — intento 2/3', time: 'Hace 3 horas', color: 'danger', icon: XMarkIcon },
  { title: 'Nuevo comentario en ticket', description: 'Carlos López respondió en TKT-012', time: 'Hace 5 horas', color: 'info', icon: InformationCircleIcon },
  { title: 'Cumplimiento de meta mensual', description: 'Meta de ventas mensual alcanzada: $45M COP', time: 'Ayer, 18:00', color: 'success', icon: CheckCircleIcon },
]

const meta = {
  title: '5-Data Display/Timeline',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lista vertical de eventos con nodos coloreados. Ideal para historial de actividad, logs y bitácoras de auditoría.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HistorialDeActividad: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Timeline items={ACTIVITY_ITEMS} />
    </div>
  ),
}

export const ConItemsPersonalizados: Story = {
  name: 'Con items personalizados',
  render: () => (
    <div style={{ width: '480px' }}>
      <Timeline
        items={[
          { title: 'Step 1: Onboarding', description: 'Usuario registrado correctamente', time: '10:00 AM', color: 'primary' },
          { title: 'Step 2: Email verificado', description: 'Link de verificación activado', time: '10:15 AM', color: 'success' },
          { title: 'Step 3: Primer login', description: 'Acceso al panel principal', time: '10:22 AM', color: 'primary' },
          { title: 'Step 4: Primer proyecto', description: 'Proyecto "Demo App" creado', time: '10:45 AM', color: 'success' },
        ]}
      />
    </div>
  ),
}
