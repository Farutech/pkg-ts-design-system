import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPasswordScreen } from '@/auth-screens/ForgotPasswordScreen'

const defaultSubmit = async () => {
  return { success: true }
}

const meta = {
  title: '8-Auth/ForgotPasswordScreen',
  component: ForgotPasswordScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pantalla de recuperación de contraseña parametrizable. Soporta 2 métodos: email (enlace directo) y admin_request (revisión por soporte). Permite configurar el nombre de la app y activar/desactivar la atribución al creador (marca blanca).',
      },
    },
  },
  argTypes: {
    appName: {
      control: 'text',
      description: 'Nombre de la aplicación',
    },
    title: {
      control: 'text',
      description: 'Título principal',
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo descriptivo',
    },
    method: {
      control: 'radio',
      options: ['email', 'admin_request'],
      description: 'Método de recuperación',
    },
    showCreator: {
      control: 'boolean',
      description: 'Mostrar atribución al creador al pie. Pon false para marca blanca.',
    },
    creatorName: {
      control: 'text',
    },
    creatorUrl: {
      control: 'text',
    },
  },
  args: {
    onSubmit: defaultSubmit,
    appName: 'FaruTech Platform',
    title: 'Recuperar contraseña',
    method: 'email',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Desarrollado por',
  },
} satisfies Meta<typeof ForgotPasswordScreen>

export default meta
type Story = StoryObj<typeof meta>

export const RecuperacionPorEmail: Story = {
  name: 'Recuperación por email (FaruTech)',
  render: (args) => (
    <ForgotPasswordScreen
      {...args}
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { success: true }
      }}
      onSuccess={() => {}}
      onBack={() => alert('Volver al login')}
    />
  ),
}

export const AplicacionPersonalizada: Story = {
  name: 'Aplicación cliente con FaruTech como creador',
  args: {
    appName: 'Afilamos Operaciones',
    title: 'Restablecer credenciales de taller',
    subtitle: 'Ingresa tu correo para recibir el enlace de acceso operativo',
    method: 'email',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Infraestructura tecnológica por',
  },
  render: (args) => (
    <ForgotPasswordScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onSuccess={() => {}}
      onBack={() => {}}
    />
  ),
}

export const MarcaBlancaSinCreador: Story = {
  name: 'Marca blanca (sin mención de creador)',
  args: {
    appName: 'Portal Corporativo',
    title: 'Recuperar contraseña corporativa',
    showCreator: false,
    method: 'admin_request',
    adminEmail: 'mesa.ayuda@empresa.com',
  },
  render: (args) => (
    <ForgotPasswordScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onSuccess={() => {}}
      onBack={() => {}}
    />
  ),
}
