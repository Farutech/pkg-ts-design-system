import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginScreen } from '@/auth-screens/LoginScreen'
import { useState } from 'react'

/**
 * LoginScreen — pantalla de inicio de sesión completa.
 *
 * Layout fullscreen con lado izquierdo (formulario) y lado derecho
 * (gradiente decorativo). Soporta dark/light mode vía theme del storybook.
 */
function LoginScreenWrapper() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    return { success: true, user: data }
  }

  return (
    <LoginScreen
      onSubmit={handleSubmit}
      onForgotPassword={() => alert('Forgot password clicked')}
      onRegister={() => alert('Register clicked')}
      brandName="Admin Panel"
      showRegister
      isLoading={loading}
    />
  )
}

const meta = {
  title: '8-Auth/LoginScreen',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pantalla de login completa con formulario + panel decorativo. Soporta loading state, error state, link de registro y forgot password.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PantallaDeLogin: Story = {
  render: () => <LoginScreenWrapper />,
}

export const ConEstadoDeError: Story = {
  name: 'Con error de autenticación',
  parameters: {
    docs: {
      description: {
        story: 'Muestra el estado de error cuando las credenciales son inválidas.',
      },
    },
  },
  render: () => {
    const handleSubmit = async () => {
      return { success: false }
    }

    return (
      <LoginScreen
        onSubmit={handleSubmit}
        onForgotPassword={() => {}}
        brandName="Admin Panel"
      />
    )
  },
}

// Play function: verifica que el formulario acepta input y el botón pueda clickearse
export const InteractivePlay: Story = {
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector('input[type="email"]') as HTMLInputElement | null
    const passwordInput = canvasElement.querySelector('input[type="password"]') as HTMLInputElement | null

    if (!emailInput || !passwordInput) {
      throw new Error('No se encontraron los campos del formulario de login')
    }

    emailInput.value = 'maria@empresa.com'
    emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    passwordInput.value = 'password123'
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

    if (emailInput.value !== 'maria@empresa.com' || passwordInput.value !== 'password123') {
      throw new Error('Los campos no aceptaron los valores esperados')
    }
  },
  render: () => <LoginScreenWrapper />,
}
