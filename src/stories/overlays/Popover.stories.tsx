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
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--ft-color-border)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>María García</p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>maria@empresa.com</p>
        </div>
        <Button variant="ghost" className="w-full" size="sm">
          <UserIcon className="h-4 w-4 mr-2" />
          Mi perfil
        </Button>
        <Button variant="ghost" className="w-full" size="sm">
          <CogIcon className="h-4 w-4 mr-2" />
          Configuración
        </Button>
        <Button variant="ghost" className="w-full" size="sm">
          <BellIcon className="h-4 w-4 mr-2" />
          Notificaciones
        </Button>
        <div style={{ borderTop: '1px solid var(--ft-color-border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
          <Button variant="danger" className="w-full" size="sm">
            Cerrar sesión
          </Button>
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
