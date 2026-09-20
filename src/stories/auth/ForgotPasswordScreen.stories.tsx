import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPasswordScreen } from '@/auth-screens/ForgotPasswordScreen'

const meta = {
  title: '8-Auth/ForgotPasswordScreen',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pantalla de recuperación de contraseña. 2 métodos: email (link de recuperación) y admin_request (revisión manual). Estados: input, sent, error.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RecuperacionPorEmail: Story = {
  render: () => (
    <ForgotPasswordScreen
      onSubmit={async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true }
      }}
      onSuccess={() => {}}
      onBack={() => {}}
      method="email"
      brandName="FaruTech"
    />
  ),
}

export const SolicitudAdmin: Story = {
  name: 'Solicitud a administrador',
  render: () => (
    <ForgotPasswordScreen
      onSubmit={async () => ({ success: true })}
      onSuccess={() => {}}
      onBack={() => {}}
      method="admin_request"
      brandName="AdminPanel"
      title="Recuperar acceso"
    />
  ),
}
