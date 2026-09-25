import type { Meta, StoryObj } from '@storybook/react-vite'
import { CRUDPage } from '@/components/crud/CRUDPage'
import type { CRUDFieldConfig, CRUDPageProps } from '@/components/crud/CRUDPage'
import { notify } from '@/components/ui/Toast'

interface UserItem {
  id: string
  name: string
  email: string
  role: string
  status: string
  department: string
}

const sampleUsers: UserItem[] = [
  { id: 'USR-001', name: 'Ana García', email: 'ana@empresa.com', role: 'Administradora', status: 'Activo', department: 'Tecnología' },
  { id: 'USR-002', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Editor', status: 'Activo', department: 'Marketing' },
  { id: 'USR-003', name: 'María Torres', email: 'maria@empresa.com', role: 'Vista', status: 'Pendiente', department: 'Ventas' },
  { id: 'USR-004', name: 'Pedro Sánchez', email: 'pedro@empresa.com', role: 'Editor', status: 'Activo', department: 'Tecnología' },
  { id: 'USR-005', name: 'Laura Martínez', email: 'laura@empresa.com', role: 'Administradora', status: 'Inactivo', department: 'RRHH' },
  { id: 'USR-006', name: 'Diego Ramírez', email: 'diego@empresa.com', role: 'Vista', status: 'Activo', department: 'Operaciones' },
  { id: 'USR-007', name: 'Sofía Herrera', email: 'sofia@empresa.com', role: 'Editor', status: 'Pendiente', department: 'Marketing' },
  { id: 'USR-008', name: 'Tomás Ruiz', email: 'tomas@empresa.com', role: 'Vista', status: 'Activo', department: 'Ventas' },
  { id: 'USR-009', name: 'Valentina Díaz', email: 'valen@empresa.com', role: 'Administradora', status: 'Activo', department: 'Tecnología' },
  { id: 'USR-010', name: 'Sebastián Romero', email: 'sebas@empresa.com', role: 'Editor', status: 'Inactivo', department: 'RRHH' },
]

const userFields: CRUDFieldConfig<UserItem>[] = [
  { key: 'name', label: 'Nombre Completo', type: 'text', required: true, placeholder: 'Ej. Juan Pérez' },
  { key: 'email', label: 'Correo Electrónico', type: 'text', required: true, placeholder: 'juan@empresa.com' },
  {
    key: 'role',
    label: 'Rol en la Plataforma',
    type: 'select',
    required: true,
    options: [
      { label: 'Administradora', value: 'Administradora' },
      { label: 'Editor', value: 'Editor' },
      { label: 'Vista', value: 'Vista' },
    ],
  },
  {
    key: 'department',
    label: 'Departamento',
    type: 'select',
    options: [
      { label: 'Tecnología', value: 'Tecnología' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Ventas', value: 'Ventas' },
      { label: 'RRHH', value: 'RRHH' },
      { label: 'Operaciones', value: 'Operaciones' },
    ],
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Pendiente', value: 'Pendiente' },
      { label: 'Inactivo', value: 'Inactivo' },
    ],
  },
]

const meta: Meta<CRUDPageProps<UserItem>> = {
  title: '11-Templates/CRUD Page',
  component: CRUDPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**CRUDPage (Componente Compuesto Super-Componente)**  
*ES*: Componente maestro configurable para operaciones CRUD completas. Soporta creación/edición en modal o navegación de página, configuración de tamaño de modal, matriz de permisos granulares, filtrado local o vía API con debounce, exportación a CSV e impresión con vista de reporte global.  
*EN*: Configurable master composite component for complete CRUD operations. Supports creation/editing in modal or page navigation, modal size definition, granular permission matrix, local or API filtering with debounce, CSV export, and printing with report views.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Título principal / Main title' },
    description: { control: 'text', description: 'Subtítulo o descripción / Subtitle description' },
    createMode: { control: 'radio', options: ['modal', 'page'], description: 'Modo de creación (modal o página) / Creation mode' },
    editMode: { control: 'radio', options: ['modal', 'page'], description: 'Modo de edición (modal o página) / Edition mode' },
    modalSize: { control: 'select', options: ['sm', 'md', 'lg', 'xl'], description: 'Tamaño del modal / Modal size' },
    canCreate: { control: 'boolean', description: 'Permite crear nuevos registros' },
    canEdit: { control: 'boolean', description: 'Permite editar registros' },
    canDelete: { control: 'boolean', description: 'Permite eliminar registros' },
    canView: { control: 'boolean', description: 'Permite ver detalles' },
    canPrint: { control: 'boolean', description: 'Permite imprimir / reporte global' },
    canExport: { control: 'boolean', description: 'Permite exportar a CSV' },
  },
}

export default meta
type Story = StoryObj<CRUDPageProps<UserItem>>

export const ModoModal: Story = {
  args: {
    title: 'Gestión de Usuarios',
    description: 'Administra los usuarios del sistema, sus roles y accesos departamentales.',
    data: sampleUsers,
    fields: userFields,
    createMode: 'modal',
    editMode: 'modal',
    modalSize: 'lg',
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    canPrint: true,
    canExport: true,
    searchPlaceholder: 'Buscar por nombre, correo, rol o departamento...',
    onSave: (record: any) => {
      notify.success(`Registro guardado: ${record?.name}`)
    },
    onDelete: (record: any) => {
      notify.warning(`Registro eliminado: ${record?.name}`)
    },
  },
}

export const ModoPaginaRedireccion: Story = {
  args: {
    title: 'Gestión de Catálogo (Navegación por Página)',
    description: 'En este modo, crear o editar redirige a una vista dedicada o formulario externo.',
    data: sampleUsers,
    fields: userFields,
    createMode: 'page',
    editMode: 'page',
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    canPrint: true,
    canExport: true,
    onCreatePage: () => {
      notify.info('Redirigiendo a /usuarios/crear...')
    },
    onEditPage: (record: any) => {
      notify.info(`Redirigiendo a /usuarios/editar/${record?.id}`)
    },
  },
}

export const FiltroApiConDebounce: Story = {
  args: {
    title: 'Búsqueda vía API con Debounce',
    description: 'Simula consulta a base de datos o API remota al escribir en el filtro con cancelación de queries previas.',
    data: sampleUsers,
    fields: userFields,
    createMode: 'modal',
    editMode: 'modal',
    onSearchApi: async (term: string) => {
      notify.info(`API Request enviado: "${term}"`)
      // Simular delay de red
      await new Promise((r) => setTimeout(r, 400))
      return sampleUsers.filter((u) =>
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase())
      )
    },
  },
}

export const PermisosRestringidos: Story = {
  args: {
    title: 'Vista de Solo Lectura y Auditoría',
    description: 'Configuración con permisos restringidos: sin crear, sin editar ni eliminar.',
    data: sampleUsers,
    fields: userFields,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    canPrint: true,
    canExport: true,
  },
}
