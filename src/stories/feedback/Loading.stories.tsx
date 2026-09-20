import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner, type SpinnerProps } from '@/components/ui/Spinner'

const meta = {
  title: '6-Feedback/Loading',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['primary', 'white', 'gray'] },
  },
  args: { size: 'md', variant: 'primary' },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Componentes de carga: `Spinner`, `Loading` (texto+spinner) y `LogoSpinner` (animación de logo).' } },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const SpinnerDefault: Story = {
  name: 'Spinner básico',
  render: (args: SpinnerProps) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Spinner size="sm" variant="primary" />
      <Spinner size="md" variant="primary" />
      <Spinner size="lg" variant="primary" />
      <Spinner size="xl" variant="primary" />
    </div>
  ),
}

export const EnBoton: Story = {
  name: 'Spinner en contexto',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'Cargando datos...', bg: 'var(--ft-color-primary)', color: 'white' },
        { label: 'Procesando...', bg: 'transparent', color: 'var(--ft-color-foreground)' },
      ].map(({ label, bg, color }) => (
        <div
          key={label}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '0.5rem',
            background: bg, color, border: bg === 'transparent' ? '1px solid var(--ft-color-border)' : 'none',
            fontSize: '0.875rem', fontWeight: 500,
          }}
        >
          <Spinner size="sm" variant={bg === 'transparent' ? 'gray' : 'white'} />
          {label}
        </div>
      ))}
    </div>
  ),
}

export const PaginaCompleta: Story = {
  name: 'Carga de página completa',
  render: () => (
    <div style={{
      width: '400px', height: '250px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)',
    }}>
      <Spinner size="xl" variant="primary" />
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--ft-color-foreground)' }}>Cargando módulo</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
          Esto puede tardar unos segundos...
        </p>
      </div>
    </div>
  ),
}
