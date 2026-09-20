import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import {
  FolderOpenIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

const meta = {
  title: '6-Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Estado vacío para listas, búsquedas y módulos sin datos. Acepta ícono, título, descripción y acción.' } },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const SinResultados: Story = {
  name: 'Sin resultados de búsqueda',
  args: {
    title: 'Sin resultados',
    description: 'No encontramos registros que coincidan con tu búsqueda. Intenta con otros términos.',
    icon: <MagnifyingGlassIcon className="h-12 w-12" />,
    action: <Button variant="outline" icon={<MagnifyingGlassIcon className="h-4 w-4" />}>Limpiar filtros</Button>,
  },
}

export const TablaVacia: Story = {
  name: 'Tabla sin registros',
  args: {
    title: 'No hay registros aún',
    description: 'Comienza creando el primer registro en este módulo.',
    icon: <FolderOpenIcon className="h-12 w-12" />,
    action: <Button icon={<PlusIcon className="h-4 w-4" />}>Crear primer registro</Button>,
  },
}

export const BandejaNoticias: Story = {
  name: 'Bandeja de entrada vacía',
  args: {
    title: 'Bandeja vacía',
    description: 'No tienes notificaciones pendientes. ¡Todo al día!',
    icon: <InboxIcon className="h-12 w-12" />,
  },
}
