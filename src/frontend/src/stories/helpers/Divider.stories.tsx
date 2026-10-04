import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider, SectionHeader as SectionHeaderComponent } from '@/components/ui/Divider'
import { Button } from '@/components/ui/Button'

const meta = {
  title: '10-Helpers/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Separador horizontal o vertical con variantes de linea (solid, dashed, dotted), espaciado y label centrado.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientacion del separador',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Estilo de la linea',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Margen o espaciado alrededor del separador',
    },
    label: {
      control: 'text',
      description: 'Texto centrado sobre la linea',
    },
    className: {
      control: 'text',
      description: 'Clases CSS personalizadas',
    },
  },
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md',
    label: 'O continuar con',
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[450px] p-6 bg-slate-900/40 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-400 mb-4">Seccion superior de contenido</p>
      <Divider {...args} />
      <p className="text-xs text-slate-400 mt-4">Seccion inferior de contenido</p>
    </div>
  ),
}

export const Vertical: Story = {
  name: 'Vertical (inline)',
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex items-center gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800 h-16">
      <Button variant="outline" size="sm">Opcion A</Button>
      <Divider {...args} />
      <Button variant="outline" size="sm">Opcion B</Button>
      <Divider {...args} />
      <Button variant="outline" size="sm">Opcion C</Button>
    </div>
  ),
}

export const SectionHeader: Story = {
  name: 'SectionHeader (utility)',
  render: () => (
    <div className="w-[400px] space-y-4">
      <SectionHeaderComponent title="Configuracion de cuenta" subtitle="Administra tu perfil y preferencias" />
      <Divider />
      <SectionHeaderComponent title="Preferencias de notificaciones" subtitle="Elige que notificaciones recibir" />
    </div>
  ),
}
