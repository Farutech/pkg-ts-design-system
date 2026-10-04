import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  FolderOpenIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

const meta = {
  title: '6-Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Estado vacio para listas, busquedas y modulos sin datos. Acepta icono, titulo, descripcion y accion.' } },
  },
  argTypes: {
    title: { control: 'text', description: 'Titulo del estado vacio' },
    description: { control: 'text', description: 'Descripcion o instruccion de accion' },
    className: { control: 'text', description: 'Clases CSS personalizadas' },
  },
  args: {
    title: 'No hay datos disponibles',
    description: 'No se encontraron registros para los filtros seleccionados.',
    icon: <MagnifyingGlassIcon className="h-12 w-12 text-violet-400" />,
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px] p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
      <EmptyState {...args} />
    </div>
  ),
}

export const SinResultados: Story = {
  name: 'Sin resultados de busqueda',
  args: {
    title: 'Sin resultados',
    description: 'No encontramos registros que coincidan con tu busqueda. Intenta con otros terminos.',
    icon: <MagnifyingGlassIcon className="h-12 w-12 text-violet-400" />,
    action: {
      label: 'Limpiar filtros',
      onClick: () => alert('Filtros reseteados'),
      variant: 'secondary',
      icon: <MagnifyingGlassIcon className="h-4 w-4" />,
    },
  },
}

export const TablaVacia: Story = {
  name: 'Tabla sin registros',
  args: {
    title: 'No hay registros aun',
    description: 'Comienza creando el primer registro en este modulo.',
    icon: <FolderOpenIcon className="h-12 w-12 text-amber-400" />,
    action: {
      label: 'Crear primer registro',
      onClick: () => alert('Crear registro'),
      icon: <PlusIcon className="h-4 w-4" />,
    },
  },
}

export const BandejaNoticias: Story = {
  name: 'Bandeja de entrada vacia',
  args: {
    title: 'Bandeja vacia',
    description: 'No tienes notificaciones pendientes. ¡Todo al dia!',
    icon: <InboxIcon className="h-12 w-12 text-emerald-400" />,
  },
}
