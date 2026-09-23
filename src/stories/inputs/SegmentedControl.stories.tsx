import type { Meta, StoryObj } from '@storybook/react-vite'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { expect, userEvent, within } from 'storybook/test'

const meta = {
  title: '4-Inputs/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'], description: 'Tamaño del control' },
    fullWidth: { control: 'boolean', description: 'Ocupar ancho total' },
    disabled: { control: 'boolean', description: 'Deshabilitar opciones' },
    defaultValue: { control: 'text', description: 'Valor activo por defecto' },
  },
  args: {
    defaultValue: 'mensual',
    options: [
      { value: 'mensual', label: 'Mensual' },
      { value: 'trimestral', label: 'Trimestral' },
      { value: 'anual', label: 'Anual' },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Control segmentado interactivo como alternativa al radio group para pocas opciones (2-5). Soporta navegación con flechas de teclado y clic directo.',
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Interactivo (Clic para cambiar opción)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const annualOption = canvas.getByRole('radio', { name: /Anual/i })
    expect(annualOption.getAttribute('aria-checked')).toBe('false')
    await userEvent.click(annualOption)
    expect(annualOption.getAttribute('aria-checked')).toBe('true')
  },
}

export const Usos: Story = {
  name: 'Casos de uso',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>Tipo de plan</p>
        <SegmentedControl value="mensual" onChange={() => {}} options={[{ value: 'mensual', label: 'Mensual' }, { value: 'anual', label: 'Anual -20%' }]} />
      </div>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>Vista del calendario</p>
        <SegmentedControl value="semana" onChange={() => {}} options={[{ value: 'dia', label: 'Día' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
      </div>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>Moneda</p>
        <SegmentedControl value="cop" onChange={() => {}} options={[{ value: 'cop', label: 'COP' }, { value: 'usd', label: 'USD' }, { value: 'eur', label: 'EUR' }]} size="sm" />
      </div>
    </div>
  ),
}
