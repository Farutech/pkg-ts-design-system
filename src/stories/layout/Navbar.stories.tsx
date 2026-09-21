import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar } from '@/components/layout/Navbar'
import type { NavbarProps } from '@/components/layout/Navbar'

/**
 * Navbar — Barra superior con breadcrumbs, notificaciones y menú de usuario.
 *
 * Altamente dinámico:
 * - Soporta usuario personalizado (`user: { name, email, avatarUrl, role }`)
 * - Soporta breadcrumbs directos o mapeo de rutas
 * - Permite ocultar búsqueda, tema o notificaciones según requerimientos del proyecto
 */
const meta = {
  title: '2-Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navbar superior con búsqueda, breadcrumbs contextuales, notificaciones y menú de usuario parametrizable para cualquier aplicación.',
      },
    },
  },
  argTypes: {
    appName: { control: 'text', description: 'Nombre de la aplicación' },
    showSearch: { control: 'boolean', description: 'Mostrar barra de búsqueda' },
    showThemeToggle: { control: 'boolean', description: 'Mostrar botón de tema' },
    showNotifications: { control: 'boolean', description: 'Mostrar notificaciones' },
    showUserMenu: { control: 'boolean', description: 'Mostrar menú de usuario' },
  },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

function NavbarStoryContainer(props: NavbarProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '320px', background: 'var(--ft-color-background)', border: '1px solid var(--ft-color-border)', borderRadius: '8px', overflow: 'hidden' }}>
      <Navbar {...props} />
      <main style={{ flex: 1, marginTop: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'var(--ft-color-muted-foreground)' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ft-color-foreground)', marginBottom: '0.5rem' }}>
            {props.user?.name ? `Sesión iniciada: ${props.user.name}` : 'Sesión iniciada'}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            {props.user?.email || 'usuario@empresa.com'} {props.user?.role && `(${props.user.role})`}
          </p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>
            Haz clic en el avatar, la campana o el buscador arriba para interactuar.
          </p>
        </div>
      </main>
    </div>
  )
}

export const PorDefecto: Story = {
  name: '1. Por defecto (Usuario FaruTech)',
  render: (args) => <NavbarStoryContainer {...args} />,
  args: {
    user: {
      name: 'Admin FaruTech',
      email: 'admin@farutech.com',
      role: 'Superadmin',
    },
    breadcrumbs: [
      { label: 'Inicio', href: '/' },
      { label: 'Administración', href: '/admin' },
      { label: 'Panel de Control', href: '/admin/dashboard' },
    ],
    showSearch: true,
    showThemeToggle: true,
    showNotifications: true,
    showUserMenu: true,
  },
}

export const ClienteAfilamos: Story = {
  name: '2. Cliente — Afilamos Operaciones',
  render: (args) => <NavbarStoryContainer {...args} />,
  args: {
    appName: 'Afilamos Operaciones',
    user: {
      name: 'Carlos Díaz',
      email: 'cdiaz@afilamos.com',
      role: 'Gerente de Planta',
    },
    breadcrumbs: [
      { label: 'Afilamos', href: '/' },
      { label: 'Producción', href: '/produccion' },
      { label: 'Línea de Afilado #3', href: '/produccion/linea-3' },
    ],
    notifications: [
      {
        id: '1',
        type: 'warning',
        title: 'Mantenimiento Preventivo',
        message: 'Línea #3 programada para revisión a las 15:00',
        time: 'Hace 10 min',
        read: false,
      },
      {
        id: '2',
        type: 'success',
        title: 'Lote #4092 Finalizado',
        message: '1,200 piezas afiladas con 0 descartes',
        time: 'Hace 1 hora',
        read: true,
      },
    ],
    showSearch: true,
    showThemeToggle: true,
    showNotifications: true,
    showUserMenu: true,
  },
}

export const MinimalWhiteLabel: Story = {
  name: '3. Marca Blanca Minimalista',
  render: (args) => <NavbarStoryContainer {...args} />,
  args: {
    appName: 'Portal Corporativo',
    user: {
      name: 'Valeria Rivas',
      email: 'valeria@corporacion.com',
      role: 'Auditor Externo',
    },
    breadcrumbs: [
      { label: 'Portal', href: '/' },
      { label: 'Reportes de Auditoría', href: '/reportes' },
    ],
    showSearch: false,
    showThemeToggle: true,
    showNotifications: false,
    showUserMenu: true,
  },
}

