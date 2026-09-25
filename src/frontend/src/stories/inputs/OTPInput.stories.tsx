import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { OTPInput } from '@/components/ui/OTPInput'
import { useState, useCallback } from 'react'

/**
 * OTPInput — Input de código de verificación de dígitos individuales.
 *
 * Soporta longitud configurable, pegado de código completo (paste),
 * navegación por teclado (flechas, backspace) y callback onComplete.
 */
const meta = {
  title: '4-Inputs/OTPInput',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input de código OTP de dígitos individuales con navegación por teclado, paste de código completo y validación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CodigoDe6Digitos: Story = {
  render: () => {
    const [otp, setOtp] = useState('')
    const [completed, setCompleted] = useState<string | null>(null)

    const handleComplete = useCallback((value: string) => {
      setCompleted(value)
    }, [])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)', textAlign: 'center' }}>
          Ingresa el código de 6 dígitos enviado a tu correo
        </p>
        <OTPInput
          value={otp}
          onChange={setOtp}
          length={6}
          onComplete={handleComplete}
        />
        {completed && (
          <div style={{
            padding: '0.75rem',
            background: 'var(--ft-color-success-soft)',
            borderRadius: '0.5rem',
            border: '1px solid var(--ft-color-success)',
            color: 'var(--ft-color-success)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}>
            ✓ Código completo: <span style={{ fontFamily: 'monospace', marginLeft: '0.5rem' }}>{completed}</span>
          </div>
        )}
        {otp && !completed && (
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            Ingresado: <span style={{ fontFamily: 'monospace', color: 'var(--ft-color-foreground)' }}>{otp.padEnd(6, '·')}</span>
          </p>
        )}
      </div>
    )
  },
}

export const ConLongitudPersonalizada: Story = {
  name: 'Longitud personalizada (4 dígitos)',
  render: () => {
    const [otp, setOtp] = useState('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>PIN de 4 dígitos</p>
        <OTPInput value={otp} onChange={setOtp} length={4} />
        {otp && (
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            PIN: <span style={{ fontFamily: 'monospace' }}>{otp}</span>
          </p>
        )}
      </div>
    )
  },
}

export const ModoSeguro: Story = {
  name: 'Modo seguro (ocultar caracteres)',
  render: () => {
    const [otp, setOtp] = useState('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>Código secreto (modo seguro)</p>
        <OTPInput value={otp} onChange={setOtp} length={6} secure />
      </div>
    )
  },
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Escribe los 6 dígitos y valida onChange + onComplete.
 */
export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  render: () => {
    const [otp, setOtp] = useState('')
    const handleChange = fn((value: string) => setOtp(value))
    const handleComplete = fn()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <OTPInput value={otp} onChange={handleChange} length={6} onComplete={handleComplete} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const firstDigit = canvas.getByLabelText(/dígito 1/i)
    await userEvent.click(firstDigit)
    await userEvent.keyboard('123456')
    const digits = [1, 2, 3, 4, 5, 6].map((n) => canvas.getByLabelText(new RegExp(`dígito ${n}`, 'i')) as HTMLInputElement)
    await expect(digits.map((input) => input.value).join('')).toBe('123456')
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica grupo accesible, dígitos etiquetados y mensaje de error.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  render: () => <OTPInput value="" onChange={() => {}} length={4} error="Código incompleto" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: /código de verificación de 4 dígitos/i })).toBeInTheDocument()
    await expect(canvas.getByLabelText(/dígito 1/i)).toBeInTheDocument()
    await expect(canvas.getByRole('alert')).toHaveTextContent(/código incompleto/i)
  },
}
