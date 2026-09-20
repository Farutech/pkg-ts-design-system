import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegisterScreen } from '@/auth-screens/RegisterScreen'

/**
 * RegisterScreen — pantalla de registro con validación y sidebar decorativo.
 *
 * Layout split: lado izquierdo (sidebar verde/tecnológico), lado derecho
 * (formulario de registro). Incluye indicador de fuerza de contraseña.
 */
function RegisterScreenWrapper() {
  const handleSubmit = async (data: any) => {
    await new Promise(r => setTimeout(r, 1500))
    return { success: true, user: data }
  }

  return (
    <RegisterScreen
      onSubmit={handleSubmit}
      onLogin={() => alert('Ir al login')}
      brandName="Farutech"
      submitButtonText="Crear mi cuenta"
      requirePhone={false}
      requireCompany={false}
    />
  )
}

const meta = {
  title: '8-Auth/RegisterScreen',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pantalla de registro con validación en tiempo real, indicador de fuerza de contraseña y sidebar decorativo.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PantallaDeRegistro: Story = {
  render: () => <RegisterScreenWrapper />,
}

export const ConErroresDeValidacion: Story = {
  name: 'Con errores de validación',
  parameters: {
    docs: {
      description: {
        story: 'Muestra los errores de validación cuando el formulario es enviado incompleto o inválido.',
      },
    },
  },
  render: () => (
    <RegisterScreen
      onSubmit={async () => ({ success: false, error: 'El nombre es requerido. La contraseña debe tener al menos 8 caracteres.' })}
      onLogin={() => {}}
      brandName="Farutech"
    />
  ),
}

export const ConPhoneYCompanyRequired: Story = {
  name: 'Con teléfono y empresa requeridos',
  render: () => (
    <RegisterScreen
      onSubmit={async () => ({ success: true })}
      onLogin={() => {}}
      brandName="Farutech"
      requirePhone
      requireCompany
      submitButtonText="Crear cuenta empresarial"
    />
  ),
}
