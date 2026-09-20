import type { Meta, StoryObj } from '@storybook/react-vite'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { fn } from '@storybook/test'

const meta = {
  title: '4-Inputs/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
  },
  args: {
    value: 'mensual',
    onChange: fn(),
    options: [
      { value: 'mensual', label: 'Mensual' },
      { value: 'trimestral', label: 'Trimestral' },
      { value: 'anual', label: 'Anual' },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Control segmentado como alternativa al radio group para pocas opciones (2-5). Exclusivo y compacto.' } },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

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
