import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, type PopoverProps } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { BellIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline'

const meta: Meta<PopoverProps> = {
  title: '7-Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel flotante interactivo con posicionamiento dinamico, trigger configurable y cierre automatico al presionar Escape o hacer click fuera.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right'],
      description: 'Posicion relativa respecto al trigger',
    },
    panelClassName: {
      control: 'text',
      description: 'Clases CSS para el panel flotante',
    },
    dismissOnClickOutside: {
      control: 'boolean',
      description: 'Cierra al hacer clic fuera del panel',
    },
    dismissOnEscape: {
      control: 'boolean',
      description: 'Cierra al presionar Escape',
    },
  },
  args: {
    placement: 'bottom',
    panelClassName: 'w-72 p-4',
    dismissOnClickOutside: true,
    dismissOnEscape: true,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="py-20">
      <Popover
        {...args}
        trigger={({ open, toggle }) => (
          <Button variant="primary" onClick={toggle}>
            {open ? 'Cerrar Popover' : 'Abrir Popover'}
          </Button>
        )}
      >
        <div className="space-y-2 text-slate-200">
          <h4 className="font-bold text-sm text-white">Panel Interactivo</h4>
          <p className="text-xs text-slate-400">
            Cambia la posicion (<code className="text-violet-400">placement</code>) o las clases CSS desde la pestana de Controles en Storybook.
          </p>
          <div className="pt-2 border-t border-slate-700/60 flex justify-end">
            <Button size="sm" variant="secondary">Entendido</Button>
          </div>
        </div>
      </Popover>
    </div>
  ),
}

export const MenuDePerfil: Story = {
  render: () => <ProfilePopover />,
}

function ProfilePopover() {
  return (
    <Popover
      trigger={({ toggle, ariaAttributes }) => (
        <Button
          variant="outline"
          aria-label="Perfil de usuario"
          {...ariaAttributes}
          onClick={toggle}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Mi perfil
        </Button>
      )}
      placement="bottom"
      panelClassName="w-64 p-2"
    >
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-1">
          <p className="m-0 font-semibold text-gray-900 dark:text-white">Maria Garcia</p>
          <p className="m-0 text-xs text-gray-500 dark:text-gray-400">maria@empresa.com</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <UserIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>Mi perfil</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <CogIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>Configuracion</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <BellIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>Notificaciones</span>
        </button>
      </div>
    </Popover>
  )
}
