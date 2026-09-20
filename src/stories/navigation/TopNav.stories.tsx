import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopNav } from '@/components/navigation/TopNav'
import type { MenuItem } from '@/components/navigation/TopNav'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  FolderIcon,
  ShieldCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { fn } from '@storybook/test'

/**
 * TopNav — Barra de navegación horizontal multinivel con:
 * - Soporte para submenús anidados (hasta 3 niveles)
 * - Filtrado por permisos
 * - Badges de notificación
 * - Menú de usuario con avatar
 * - Responsive con menú hamburguesa en móvil
 */

const SIMPLE_MENU: MenuItem[] = [
  { id: 'home', label: 'Inicio', icon: <HomeIcon className="h-4 w-4" />, path: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon className="h-4 w-4" />, path: '/dashboard' },
  { id: 'users', label: 'Usuarios', icon: <UsersIcon className="h-4 w-4" />, path: '/users', badge: 3 },
  { id: 'settings', label: 'Configuración', icon: <CogIcon className="h-4 w-4" />, path: '/settings' },
]

const MULTILEVEL_MENU: MenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: <HomeIcon className="h-4 w-4" />,
    path: '/',
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: <ShoppingCartIcon className="h-4 w-4" />,
    children: [
      { id: 'ventas-dashboard', label: 'Dashboard de Ventas', path: '/ventas' },
      { id: 'ventas-ordenes', label: 'Órdenes', path: '/ventas/ordenes', badge: 12 },
      {
        id: 'ventas-informes',
        label: 'Informes',
        icon: <DocumentTextIcon className="h-4 w-4" />,
        children: [
          { id: 'informe-mensual', label: 'Informe mensual', path: '/ventas/informes/mensual' },
          { id: 'informe-anual', label: 'Informe anual', path: '/ventas/informes/anual' },
          { id: 'informe-comparativo', label: 'Comparativo', path: '/ventas/informes/comparativo' },
        ],
      },
      { id: 'ventas-facturas', label: 'Facturación', path: '/ventas/facturas' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: <BuildingOfficeIcon className="h-4 w-4" />,
    children: [
      { id: 'crm-clientes', label: 'Clientes', path: '/crm/clientes' },
      { id: 'crm-leads', label: 'Leads', path: '/crm/leads', badge: 5 },
      { id: 'crm-segmentos', label: 'Segmentos', path: '/crm/segmentos' },
      {
        id: 'crm-comunicacion',
        label: 'Comunicación',
        children: [
          { id: 'crm-emails', label: 'Correos', path: '/crm/emails' },
          { id: 'crm-llamadas', label: 'Llamadas', path: '/crm/llamadas' },
          { id: 'crm-reuniones', label: 'Reuniones', path: '/crm/reuniones' },
        ],
      },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: <CurrencyDollarIcon className="h-4 w-4" />,
    children: [
      { id: 'finanzas-balance', label: 'Balance general', path: '/finanzas/balance' },
      { id: 'finanzas-gastos', label: 'Gastos', path: '/finanzas/gastos' },
      { id: 'finanzas-presupuesto', label: 'Presupuesto', path: '/finanzas/presupuesto' },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: <ShieldCheckIcon className="h-4 w-4" />,
    permission: 'admin',
    children: [
      { id: 'admin-roles', label: 'Roles y permisos', path: '/admin/roles', permission: 'admin' },
      { id: 'admin-auditoria', label: 'Auditoría', path: '/admin/auditoria', permission: 'admin' },
      { id: 'admin-sistema', label: 'Sistema', path: '/admin/sistema', permission: 'superadmin' },
    ],
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: <BellIcon className="h-4 w-4" />,
    badge: 7,
    path: '/notificaciones',
  },
]

const USER_MENU = {
  name: 'María García',
  email: 'maria@farutech.com',
  items: [
    { id: 'perfil', label: 'Mi perfil', icon: <UsersIcon className="h-4 w-4" />, path: '/perfil' },
    { id: 'config', label: 'Configuración', icon: <CogIcon className="h-4 w-4" />, path: '/settings' },
    { id: 'divider', label: '' },
    { id: 'logout', label: 'Cerrar sesión', onClick: () => console.log('logout') },
  ],
}

const meta = {
  title: '3-Navigation/TopNav',
  component: TopNav,
  argTypes: {
    brandName: { control: 'text' },
  },
  args: {
    brandName: 'FaruTech',
    menuItems: SIMPLE_MENU,
    onMenuClick: fn(),
    onUserAction: fn(),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Menú horizontal multinivel con soporte de permisos.
- Items con \`children\` abren un **dropdown** al hacer clic
- \`permission\` filtra los items según las props \`permissions\`
- \`badge\` muestra un contador en el item
- Responsive: en móvil se colapsa en menú hamburguesa`,
      },
    },
  },
} satisfies Meta<typeof TopNav>

export default meta
type Story = StoryObj<typeof meta>

/** Menú horizontal simple (4 ítems planos) */
export const Default: Story = {
  args: {
    menuItems: SIMPLE_MENU,
    userMenu: USER_MENU,
  },
}

/** 3 niveles de profundidad — Ventas → Informes → Tipos */
export const Multinivel: Story = {
  name: 'Multinivel (3 niveles)',
  args: {
    menuItems: MULTILEVEL_MENU,
    userMenu: USER_MENU,
    permissions: ['admin'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Menú con 3 niveles de anidamiento. Los items de Administración solo se muestran porque `permissions` incluye `"admin"`.',
      },
    },
  },
}

/** Con filtrado por permisos — admin oculto */
export const ConPermisos: Story = {
  name: 'Con permisos (sin admin)',
  args: {
    menuItems: MULTILEVEL_MENU,
    userMenu: USER_MENU,
    permissions: [],  // sin permisos → Administración oculta
  },
  parameters: {
    docs: {
      description: {
        story: 'Con `permissions: []`, el item de Administración (que requiere `permission: "admin"`) queda oculto automáticamente.',
      },
    },
  },
}

/** Sin menú de usuario */
export const SinUserMenu: Story = {
  name: 'Sin menú de usuario',
  args: {
    menuItems: MULTILEVEL_MENU,
    permissions: ['admin'],
  },
}
