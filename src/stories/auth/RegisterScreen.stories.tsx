import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegisterScreen } from '@/auth-screens/RegisterScreen'

const defaultSubmit = async (data: any) => {
  return { success: true, user: data }
}

/**
 * RegisterScreen — Pantalla de registro empresarial con validación en tiempo real y alta parametrización.
 */
const meta = {
  title: '8-Auth/RegisterScreen',
  component: RegisterScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pantalla de registro completa y dinámica con psicología de color, panel de beneficios personalizable, validación en tiempo real de contraseña y opción para activar/desactivar la atribución al creador (marca blanca).',
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
    welcomeTitle: {
      control: 'text',
      description: 'Título en el panel izquierdo de beneficios',
    },
    welcomeSubtitle: {
      control: 'text',
      description: 'Subtítulo en el panel izquierdo de beneficios',
    },
    showCreator: {
      control: 'boolean',
      description: 'Mostrar u ocultar la atribución al creador al pie. Pon false para marca blanca.',
    },
    creatorName: {
      control: 'text',
      description: 'Nombre de la empresa desarrolladora (default: FaruTech)',
    },
    creatorUrl: {
      control: 'text',
      description: 'URL de la empresa desarrolladora',
    },
    submitButtonText: {
      control: 'text',
      description: 'Texto del botón principal de registro',
    },
    requirePhone: {
      control: 'boolean',
      description: 'Solicitar número de teléfono obligatorio',
    },
    requireCompany: {
      control: 'boolean',
      description: 'Solicitar nombre de empresa obligatorio',
    },
  },
  args: {
    onSubmit: defaultSubmit,
    brandName: 'FaruTech Platform',
    appName: '',
    submitButtonText: 'Crear mi cuenta',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Desarrollado por',
    welcomeTitle: 'Únete a FaruTech',
    welcomeSubtitle: 'Gestiona tu negocio y haz crecer tus proyectos con nuestra plataforma.',
    requirePhone: false,
    requireCompany: false,
  },
} satisfies Meta<typeof RegisterScreen>

export default meta
type Story = StoryObj<typeof meta>

export const PorDefecto: Story = {
  name: 'Plataforma FaruTech (con creador)',
  render: (args) => (
    <RegisterScreen
      {...args}
      onSubmit={async (data) => {
        await new Promise((r) => setTimeout(r, 1200))
        return { success: true, user: data }
      }}
      onLogin={() => alert('Redirigiendo al login')}
    />
  ),
}

export const AplicacionPersonalizada: Story = {
  name: 'Aplicación cliente con FaruTech como creador',
  args: {
    appName: 'Afilamos Operaciones',
    welcomeTitle: 'Únete a Afilamos',
    welcomeSubtitle: 'Regístrate para solicitar servicios de afilado, consultar estados y gestionar órdenes.',
    features: [
      'Seguimiento en vivo de órdenes',
      'Historial de mantenimiento de herramientas',
      'Facturación y cotizaciones automatizadas',
    ],
    submitButtonText: 'Registrar nueva empresa',
    requirePhone: true,
    requireCompany: true,
    showCreator: true,
    creatorName: 'FaruTech',
    creatorUrl: 'https://farutech.com',
    creatorPrefix: 'Plataforma desarrollada por',
  },
  render: (args) => (
    <RegisterScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onLogin={() => {}}
    />
  ),
}

export const MarcaBlancaSinCreador: Story = {
  name: 'Marca blanca (sin mención de creador)',
  args: {
    appName: 'SaaS Empresarial',
    welcomeTitle: 'Crear cuenta de equipo',
    welcomeSubtitle: 'Colaboración centralizada y gestión de proyectos para tu empresa.',
    showCreator: false,
    features: [
      'Espacios de trabajo dedicados',
      'Seguridad y encriptación de grado bancario',
      'Soporte técnico prioritario 24/7',
    ],
  },
  render: (args) => (
    <RegisterScreen
      {...args}
      onSubmit={async () => ({ success: true })}
      onLogin={() => {}}
    />
  ),
}

export const ConErroresDeValidacion: Story = {
  name: 'Con errores de validación',
  render: (args) => (
    <RegisterScreen
      {...args}
      onSubmit={async () => ({
        success: false,
        error: 'El correo electrónico ya se encuentra registrado. Por favor inicia sesión o recupera tu contraseña.',
      })}
      onLogin={() => {}}
    />
  ),
}
