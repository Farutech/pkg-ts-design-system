import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeIcon, Squares2X2Icon, CodeBracketIcon, BookmarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { SideNavItem } from '@/components/layout/SideNavItem'

const noop = () => undefined

/**
 * SideNavItem — Ítem base de navegación lateral con icono, etiqueta,
 * descripción opcional, badge y estado activo.
 *
 * - `active` aplica `aria-current="page"` y los estilos de selección con tokens
 * - `badge` admite cualquier nodo (contadores, textos cortos)
 * - `className` / `badgeClassName` permiten tematizar por app sin fork del paquete
 * - No depende de react-router ni de los stores: el consumidor controla el clic
 */

const meta = {
  title: 'Navigation/SideNavItem',
  component: SideNavItem,
  tags: ['autodocs'],
  args: {
    onClick: noop,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ítem de sidebar reutilizable. A diferencia de `layout/Sidebar` (que exige router y ConfigContext), este componente es autónomo: la app consumidora decide navegación, colores activos y contenido del badge.',
      },
    },
  },
} satisfies Meta<typeof SideNavItem>

export default meta
type Story = StoryObj<typeof meta>

/** Ítem simple sin extras */
export const Default: Story = {
  args: {
    label: 'Visión General',
    icon: <HomeIcon className="h-4 w-4" />,
  },
}

/** Con descripción y badge (patrón de catálogo/secciones) */
export const ConDescripcionYBadge: Story = {
  name: 'Con descripción y badge',
  args: {
    label: 'Catálogo de Repos',
    description: 'Inventario vivo ecosystem.yaml',
    badge: '15',
    icon: <Squares2X2Icon className="h-4 w-4" />,
  },
}

/** Estado activo (marca aria-current y estilos de selección) */
export const Activo: Story = {
  args: {
    label: 'Decisiones (ADRs)',
    description: 'ADR-001 al 004 & FEKS',
    badge: '7',
    active: true,
    icon: <CodeBracketIcon className="h-4 w-4" />,
  },
}

/** Tematizado por el consumidor: conserva la identidad cyan de la app */
export const Tematizado: Story = {
  args: {
    label: 'Estándares FEKS',
    description: 'Manual Técnico Unificado',
    badge: '20',
    active: true,
    icon: <BookmarkIcon className="h-4 w-4" />,
    className: 'bg-slate-800 text-cyan-300 border-slate-700',
    badgeClassName: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  },
}

/** Deshabilitado */
export const Deshabilitado: Story = {
  args: {
    label: 'Validador de Contratos',
    description: 'No disponible en esta sesión',
    disabled: true,
    icon: <ShieldCheckIcon className="h-4 w-4" />,
  },
}
