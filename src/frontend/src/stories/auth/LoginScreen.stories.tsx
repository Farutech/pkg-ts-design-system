import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginScreen } from '@/auth-screens/LoginScreen'
import { useState } from 'react'

const defaultSubmit = async (creds: any) => {
  return { success: true, user: creds }
}

/**
 * LoginScreen — Pantalla de inicio de sesión empresarial altamente parametrizable.
 *
 * Soporta:
 * - Nombre de aplicación propio (`appName`)
 * - Opción de mostrar u ocultar la atribución al creador (`showCreator: true | false`)
 * - Personalización de textos, labels, placeholders y panel de bienvenida
 * - Modo oscuro y claro automático vía tokens del Design System
 */
const meta = {
  title: '8-Auth/LoginScreen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pantalla de inicio de sesión completa y dinámica. Permite configurar el nombre de la aplicación de cada cliente/producto, decidir si mostrar "Desarrollado por FaruTech" (o desactivarlo para marca blanca) y personalizar todos los textos y campos.',
      },
    },
  },
  argTypes: {
    brandName: {
      control: 'text',
      description: 'Nombre de la marca o aplicación (alias prioritario de appName)',
    },
    appName: {
      control: 'text',
      description: 'Nombre de la aplicación o producto',
    },
    description: {
      control: 'text',
      description: 'Descripción o subtítulo debajo del título',
    },
    showCreator: {
      control: 'boolean',
      description: 'Si es true muestra la atribución al creador al pie. Pon false para marca blanca.',
    },
    creatorName: {
      control: 'text',
      description: 'Nombre de la empresa creadora (ej: FaruTech)',
    },
    creatorUrl: {
      control: 'text',
      description: 'Enlace web de la empresa creadora',
    },
    creatorPrefix: {
      control: 'text',
      description: 'Prefijo antes del nombre del creador (ej: Desarrollado por, Powered by)',
    },
    welcomeTitle: {
      control: 'text',
      description: 'Título en el panel decorativo lateral',
    },
    welcomeSubtitle: {
      control: 'text',
      description: 'Mensaje descriptivo en el panel decorativo lateral',
    },
    showRegister: {
      control: 'boolean',
      description: 'Muestra u oculta el enlace para registrarse',
    },
    emailLabel: { control: 'text' },
    passwordLabel: { control: 'text' },
    submitButtonText: { control: 'text' },
  },
  args: {
    onSubmit: defaultSubmit,
    brandName: 'FaruTech Platform',
    appName: '',
    description: 'Ingresa tus credenciales para continuar',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Desarrollado por',
    welcomeTitle: 'Bienvenido de nuevo',
    welcomeSubtitle: 'Accede a tu panel para gestionar todos los aspectos de tu aplicación',
    showRegister: true,
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    submitButtonText: 'Iniciar sesión',
  },
} satisfies Meta<typeof LoginScreen>

export default meta
type Story = StoryObj<typeof meta>

export const PorDefecto: Story = {
  name: 'Plataforma FaruTech (con creador)',
  render: (args) => {
    const [loading, setLoading] = useState(false)
    return (
      <LoginScreen
        {...args}
        isLoading={loading}
        onSubmit={async (creds) => {
          setLoading(true)
          await new Promise((r) => setTimeout(r, 1200))
          setLoading(false)
          return { success: true, user: creds }
        }}
        onForgotPassword={() => alert('Recuperar contraseña clickeado')}
        onRegister={() => alert('Registro clickeado')}
      />
    )
  },
}

export const AplicacionPersonalizada: Story = {
  name: 'Aplicación cliente con FaruTech como creador',
  args: {
    appName: 'Afilamos Operaciones',
    description: 'Gestión integral de órdenes, inventario y afilado industrial',
    welcomeTitle: 'Afilamos Hermanos',
    welcomeSubtitle: 'Sistema de control operativo y trazabilidad en planta',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Tecnología desarrollada por',
  },
  render: (args) => (
    <LoginScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onForgotPassword={() => {}}
      onRegister={() => {}}
    />
  ),
}

export const MarcaBlancaSinCreador: Story = {
  name: 'Marca blanca (sin mención de creador)',
  args: {
    appName: 'Portal Corporativo',
    description: 'Acceso seguro exclusivo para colaboradores',
    welcomeTitle: 'Portal Empresarial',
    welcomeSubtitle: 'Herramientas de productividad y reportes internos',
    showCreator: false,
    showRegister: false,
  },
  render: (args) => (
    <LoginScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onForgotPassword={() => {}}
    />
  ),
}

export const ConError: Story = {
  name: 'Con error de credenciales',
  render: (args) => (
    <LoginScreen
      {...args}
      onSubmit={async () => ({ success: false, error: 'El correo electrónico o la contraseña son incorrectos.' })}
      onForgotPassword={() => {}}
    />
  ),
}

export const InteractivePlay: Story = {
  name: 'Test interactivo Storybook',
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector('input[type="email"]') as HTMLInputElement | null
    const passwordInput = canvasElement.querySelector('input[type="password"]') as HTMLInputElement | null

    if (!emailInput || !passwordInput) {
      throw new Error('No se encontraron los campos del formulario de login')
    }

    emailInput.value = 'operaciones@empresa.com'
    emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    passwordInput.value = 'Segura_2026!'
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

    if (emailInput.value !== 'operaciones@empresa.com' || passwordInput.value !== 'Segura_2026!') {
      throw new Error('Los campos no aceptaron los valores esperados')
    }
  },
  render: (args) => (
    <LoginScreen
      {...args}
      appName="Afilamos Test"
      onSubmit={async () => ({ success: true })}
    />
  ),
}
