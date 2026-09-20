import type { Meta, StoryObj } from '@storybook/react-vite'
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
