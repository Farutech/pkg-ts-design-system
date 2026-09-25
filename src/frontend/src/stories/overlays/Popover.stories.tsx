import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BellIcon, MagnifyingGlassIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline'

/**
 * Popover — Panel flotante que se activa desde un trigger personalizado.
 *
 * El trigger recibe `open` y `toggle` para controlar su estado.
 * El panel se puede posicionar: bottom (default), top, left, right.
 */
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
          <p className="m-0 font-semibold text-gray-900 dark:text-white">María García</p>
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
          <span>Configuración</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <BellIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>Notificaciones</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="w-4 shrink-0" /> {/* Espaciador para alinear con items que tienen icono */}
          <span>Centro de ayuda (sin icono)</span>
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
          <button
            type="button"
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="w-4 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </Popover>
  )
}

function FormPopover() {
  return (
    <Popover
      trigger={({ open, toggle, ariaAttributes }) => (
        <Button onClick={toggle} {...ariaAttributes}>
          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
          {open ? 'Cerrar' : 'Abrir formulario'}
        </Button>
      )}
      placement="bottom"
      panelClassName="w-80"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Contacto rápido</h3>
        <Input label="Nombre" placeholder="Tu nombre" />
        <Input label="Correo" type="email" placeholder="tu@email.com" />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--ft-color-border)' }}>
          <Button variant="ghost">Cancelar</Button>
          <Button>Enviar</Button>
        </div>
      </div>
    </Popover>
  )
}

const meta = {
  title: '7-Overlays/Popover',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel flotante con trigger personalizado. Soporta 4 posiciones y cierre por Escape o click fuera.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MenuDePerfil: Story = {
  render: () => <ProfilePopover />,
}

export const ConFormulario: Story = {
  render: () => <FormPopover />,
}

export const Posiciones: Story = {
  name: '4 posiciones',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
      {(['bottom', 'top', 'left', 'right'] as const).map((placement) => (
        <Popover
          key={placement}
          trigger={({ toggle }) => (
            <Button variant="outline" onClick={toggle}>
              {placement} — click
            </Button>
          )}
          placement={placement}
        >
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Popover {placement}
          </p>
        </Popover>
      ))}
    </div>
  ),
}
