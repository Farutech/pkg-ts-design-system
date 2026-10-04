import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  CrudPagination,
  DEFAULT_PER_PAGE_OPTIONS,
  type CrudPaginationProps,
} from '@/components/crud/CrudPagination'
import { Button } from '@/components/ui/Button'

/**
 * Wrapper controlado para que los controles de Storybook funcionen.
 */
const Controlled = (props: Omit<CrudPaginationProps, 'currentPage' | 'onPageChange' | 'perPage' | 'onPerPageChange' | 'totalPages'> & {
  initialPage?: number
  initialPerPage?: number
  total?: number
  totalPages?: number
}) => {
  const [page, setPage] = useState(props.initialPage ?? 1)
  const [perPage, setPerPage] = useState(props.initialPerPage ?? 10)
  const total = props.total ?? 247
  const totalPages =
    props.totalPages ?? Math.max(1, Math.ceil(total / perPage))
  return (
    <CrudPagination
      currentPage={page}
      totalPages={totalPages}
      perPage={perPage}
      total={total}
      onPageChange={setPage}
      onPerPageChange={(s) => {
        setPerPage(s)
        setPage(1)
      }}
      perPageOptions={props.perPageOptions}
      showJumpToPage={props.showJumpToPage}
      variant={props.variant}
      className={props.className}
    />
  )
}

const meta = {
  title: '5-Data Display/Crud Pagination',
  component: CrudPagination,
  parameters: {
    docs: {
      description: {
        component: `
**CrudPagination** — Paginador estandarizado de 3 columnas equilibradas.

- Columna 1: Resumen (Página N de M — total de elementos)
- Columna 2: Navegación numérica (primera / anterior / números / siguiente / última)
- Columna 3: Selector "Por página" + Salto directo a página (input numérico)

**Props configurables:**
- \`perPageOptions\`: array de opciones para el selector (default: [10, 25, 50, 100])
- \`showJumpToPage\`: habilita el input "Ir a" (default: true)
- \`variant\`: 'dark' (admin), 'default' (light), 'transparent'

Usa \`DEFAULT_PER_PAGE_OPTIONS\` como valor por defecto. Compatible con iconos Heroicons (ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight).
        `,
      },
    },
    viewport: { defaultViewport: 'desktop' },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['dark', 'default', 'transparent'],
      description: 'Tema del paginador',
    },
    perPageOptions: {
      control: 'object',
      description: 'Opciones del selector "Por página"',
    },
    showJumpToPage: {
      control: 'boolean',
      description: 'Habilitar input "Ir a página"',
    },
    total: {
      control: { type: 'number', min: 0, max: 5000, step: 10 },
      description: 'Total de elementos',
    },
  },
  args: {
    variant: 'dark',
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
    showJumpToPage: true,
    total: 247,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '1.5rem',
          background: 'var(--ft-color-background, #0b0d12)',
        }}
      >
        <div
          style={{
            background: '#15161d',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
} as Meta<any>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default: tema dark, opciones estándar, jump-to-page activo.
 */
export const Default: Story = {
  render: (args) => <Controlled {...args} total={247} />,
}

/**
 * Muchas páginas (útil para validar el rango de números visibles).
 */
export const ManyPages: Story = {
  render: (args) => <Controlled {...args} total={3420} initialPerPage={25} />,
}

/**
 * Pocas páginas (3) — verifica que la navegación numérica no muestra elipsis.
 */
export const FewPages: Story = {
  render: (args) => <Controlled {...args} total={27} initialPerPage={10} />,
}

/**
 * Catálogo pequeño — perPageOptions reducidas.
 */
export const SmallCatalog: Story = {
  args: {
    perPageOptions: [5, 10, 25],
  },
  render: (args) => <Controlled {...args} total={87} initialPerPage={5} />,
}

/**
 * Variante light (modo claro / multi-tenant).
 */
export const LightVariant: Story = {
  parameters: { theme: 'light' },
  args: { variant: 'default' },
  render: (args) => (
    <div style={{ padding: '1.5rem', background: '#f1f5f9' }}>
      <Controlled {...args} total={247} />
    </div>
  ),
}

/**
 * Variante transparente — útil sobre fondos con imagen.
 */
export const TransparentVariant: Story = {
  args: { variant: 'transparent' },
  render: (args) => (
    <div
      style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Controlled {...args} total={247} />
    </div>
  ),
}

/**
 * Sin jump-to-page — solo el selector de perPage.
 */
export const WithoutJumpToPage: Story = {
  args: { showJumpToPage: false },
  render: (args) => <Controlled {...args} total={247} />,
}

/**
 * Solo una página — para verificar que la paginación no se renderiza o se ve compacta.
 */
export const SinglePage: Story = {
  render: (args) => <Controlled {...args} total={3} initialPerPage={10} />,
}

/**
 * Mobile: 375px.
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: (args) => <Controlled {...args} total={247} />,
}

/**
 * Tablet: 768px.
 */
export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
  render: (args) => <Controlled {...args} total={247} />,
}

/**
 * Con botones "Saltar al inicio" y "Saltar al final" — útil para catálogos muy grandes.
 */
export const WithExternalActions: Story = {
  render: (args) => {
    const [page, setPage] = useState(12)
    const [perPage, _setPerPage] = useState(25)
    const total = 3420
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
        <Button variant="ghost" size="sm" onClick={() => setPage(1)}>
          Ir al inicio
        </Button>
        <Controlled
          {...args}
          total={total}
          totalPages={totalPages}
          initialPage={page}
          initialPerPage={perPage}
        />
        <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)}>
          Ir al final
        </Button>
      </div>
    )
  },
}