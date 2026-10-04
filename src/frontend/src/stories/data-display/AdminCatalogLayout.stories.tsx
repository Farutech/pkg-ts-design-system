import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AdminCatalogLayout,
  AdminTableHeader,
  AdminTableRow,
} from '@/components/crud/AdminCatalogLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Layers, Plus, Settings, Users, Briefcase, CreditCard } from 'lucide-react'

const meta = {
  title: '11-Templates/Admin Catalog Layout',
  component: AdminCatalogLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**AdminCatalogLayout** — Header + panel estandarizado para CRUDs.

Encapsula el patrón visual de referencia con:
- Eyebrow + Título + Descripción + Icono
- Slot para \`headerActions\` (botones primarios)
- Panel translúcido de fondo para el contenido
- Variantes: \`dark\` (default, admin) y \`default\` (light)

Exporta además \`AdminTableHeader\` y \`AdminTableRow\` para mantener consistencia visual en las tablas que el consumidor renderice dentro del panel.
        `,
      },
    },
    viewport: { defaultViewport: 'desktop' },
  },
  argTypes: {
    eyebrow: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['dark', 'default'],
    },
  },
  args: {
    eyebrow: 'ADMINISTRACIÓN · CLIENTES',
    title: 'Segmentos de Clientes',
    description:
      'Estratificación comercial, condiciones de crédito y descuentos por perfil de cliente.',
    icon: <Users className="h-5 w-5" />,
    variant: 'dark',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '1.5rem',
          background: 'var(--ft-color-background, #0b0d12)',
          minHeight: '100vh',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminCatalogLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Header + tabla de segmentos.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <AdminTableHeader>
          <span>SEGMENTO</span>
          <span>CÓDIGO</span>
          <span>DESCUENTO</span>
          <span>PLAZO</span>
          <span>ESTADO</span>
        </AdminTableHeader>
        {[
          { nombre: 'Industrias y Fábricas', codigo: 'SEG-IND', desc: 15, plazo: 30, activo: true },
          { nombre: 'Talleres de Carpintería', codigo: 'SEG-TAL', desc: 10, plazo: 15, activo: true },
          { nombre: 'Clientes Minoristas', codigo: 'SEG-RET', desc: 0, plazo: 0, activo: true },
          { nombre: 'Cuentas Estratégicas', codigo: 'SEG-VIP', desc: 20, plazo: 45, activo: true },
        ].map((s, _i) => (
          <AdminTableRow
            key={s.codigo}
            className="grid-cols-[2fr_1fr_1fr_1fr_1fr]"
          >
            <span style={{ color: '#fff', fontWeight: 600 }}>{s.nombre}</span>
            <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{s.codigo}</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{s.desc}%</span>
            <span style={{ color: '#cbd5e1' }}>{s.plazo} días</span>
            <Badge variant={s.activo ? 'success' : 'neutral'}>
              {s.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </AdminTableRow>
        ))}
      </>
    ),
  },
}

/**
 * Vista con acciones globales (botones "Configurar" + "Nuevo").
 */
export const WithHeaderActions: Story = {
  args: {
    ...Default.args,
    headerActions: (
      <>
        <Button variant="secondary" icon={<Settings className="h-4 w-4" />}>
          Configurar
        </Button>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Nuevo Segmento
        </Button>
      </>
    ),
  },
}

/**
 * Variante light (modo claro) — útil para temas multi-tenant.
 */
export const LightVariant: Story = {
  parameters: { theme: 'light' },
  args: {
    ...Default.args,
    variant: 'default',
    icon: <Briefcase className="h-5 w-5" />,
    eyebrow: 'TESORERÍA · LISTAS DE PRECIO',
    title: 'Listas de Precios',
    description: 'Administra tarifas por segmento de cliente y tipo de ítem.',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1.5rem', background: '#f1f5f9', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * Sin descripción — header mínimo.
 */
export const MinimalHeader: Story = {
  args: {
    eyebrow: 'SISTEMA · PARÁMETROS',
    title: 'Parámetros Operativos',
    icon: <Layers className="h-5 w-5" />,
    children: (
      <div style={{ padding: 32, color: '#cbd5e1' }}>
        <p style={{ fontSize: 14 }}>
          Panel de contenido libre — sin eyebrow ni descripción para una cabecera más limpia.
        </p>
      </div>
    ),
  },
}

/**
 * Mobile (375px).
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  args: WithHeaderActions.args,
}

/**
 * Tablet (iPad 768px).
 */
export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
  args: WithHeaderActions.args,
}

/**
 * Laptop (1280px).
 */
export const Laptop: Story = {
  parameters: { viewport: { defaultViewport: 'laptop' } },
  args: WithHeaderActions.args,
}

/**
 * Con muchos botones en headerActions (para validar wrap responsivo).
 */
export const ManyActions: Story = {
  args: {
    ...Default.args,
    icon: <CreditCard className="h-5 w-5" />,
    title: 'Medios de Pago',
    headerActions: (
      <>
        <Button variant="ghost" size="sm">
          Exportar
        </Button>
        <Button variant="secondary" size="sm">
          Importar
        </Button>
        <Button variant="secondary" size="sm">
          Configurar
        </Button>
        <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
          Nuevo Medio
        </Button>
      </>
    ),
  },
}