import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, within } from 'storybook/test'
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

/**
 * 2. Test de Funcionalidad e Interacción:
 * Cambia el valor del slider y verifica el callback onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Cambio de Valor e Interacción',
  args: {
    label: 'Volumen de prueba',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', { name: /volumen de prueba/i })
    await expect(slider).toHaveValue('50')
    fireEvent.change(slider, { target: { value: '75' } })
    await expect(args.onChange).toHaveBeenCalledWith(75)
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica rol slider, valores min/max/now y estado deshabilitado.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'Volumen bloqueado',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', { name: /volumen bloqueado/i })
    await expect(slider).toBeInTheDocument()
    await expect(slider).toBeDisabled()
    await expect(slider).toHaveAttribute('aria-valuemin', '0')
    await expect(slider).toHaveAttribute('aria-valuemax', '100')
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
  },
}

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
