import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from '@/components/ui/Slider'

const meta = {
  title: '4-Inputs/Slider',
  component: Slider,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { value: 50, min: 0, max: 100, step: 1, label: 'Volumen', onChange: () => {} },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Slider de rango con label, formato de valor y estado deshabilitado.' } },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Ejemplos: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Slider value={72} min={0} max={100} label="Progreso del onboarding" formatValue={(v) => `${v}%`} onChange={() => {}} />
      <Slider value={3} min={1} max={5} step={0.5} label="Calificación" formatValue={(v) => `${v} / 5 ★`} onChange={() => {}} />
      <Slider value={1500} min={500} max={10000} step={500} label="Presupuesto mensual" formatValue={(v) => `$${v.toLocaleString()}`} onChange={() => {}} />
      <Slider value={40} min={0} max={100} label="Opacidad" formatValue={(v) => `${v}%`} disabled onChange={() => {}} />
    </div>
  ),
}
