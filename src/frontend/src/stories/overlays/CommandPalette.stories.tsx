import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandPalette } from '@/components/ui/CommandPalette'

/**
 * CommandPalette — paleta de comandos tipo Ctrl+K / ⌘K.
 *
 * Soporta comandos agrupados, búsqueda por título/descripción/keywords,
 * comandos recientes y atajo de teclado Control+K (Cmd+K en Mac).
 */
const COMMANDS = [
  { id: 'new-user', title: 'Crear usuario', description: 'Agregar un nuevo usuario al sistema', group: 'Usuarios', keywords: ['crear', 'usuario', 'nuevo'], icon: '👤', action: () => alert('Nuevo usuario') },
  { id: 'edit-user', title: 'Editar usuario', description: 'Modificar datos de un usuario existente', group: 'Usuarios', keywords: ['editar', 'usuario', 'modificar'], icon: '✏️', action: () => alert('Editar usuario') },
  { id: 'delete-user', title: 'Eliminar usuario', description: 'Remover un usuario del sistema (no reversible)', group: 'Usuarios', keywords: ['eliminar', 'usuario', 'borrar'], icon: '🗑️', action: () => alert('Eliminar usuario') },
  { id: 'new-project', title: 'Crear proyecto', description: 'Agregar un nuevo proyecto', group: 'Proyectos', keywords: ['crear', 'proyecto', 'nuevo'], icon: '📁', action: () => alert('Nuevo proyecto') },
  { id: 'reports', title: 'Ver reportes', description: 'Acceder a los reportes disponibles', group: 'Reportes', keywords: ['reportes', 'estadísticas', 'datos'], icon: '📊', action: () => alert('Reportes') },
  { id: 'settings', title: 'Configuración', description: 'Ajustes generales de la aplicación', group: 'Sistema', keywords: ['config', 'ajustes', 'preferences'], icon: '⚙️', action: () => alert('Settings') },
  { id: 'logout', title: 'Cerrar sesión', description: 'Terminar la sesión actual', group: 'Sistema', keywords: ['logout', 'salir', 'cerrar'], icon: '🚪', action: () => alert('Logout') },
]

const meta = {
  title: '7-Overlays/CommandPalette',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Paleta de comandos tipo Ctrl+K / ⌘K con búsqueda, comandos agrupados, recientes y atajo de teclado.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PaletaDeComandos: Story = {
  render: () => <CommandPalette commands={COMMANDS} recentCommands={['new-user', 'settings']} placeholder="Buscar o ejecutar un comando..." />,
}

export const ConGrupos: Story = {
  name: 'Con grupos de comandos',
  render: () => <CommandPalette commands={COMMANDS} recentCommands={['new-user']} />,
}
