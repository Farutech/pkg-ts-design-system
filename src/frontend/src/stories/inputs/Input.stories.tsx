import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Input } from '@/components/ui/Input'

/**
 * # Input (Best-of-Breed Unificado) - FaruTech Design System
 * 
 * ## Árbol de Decisión de Selección de Variante (Decision Tree)
 * 
 * ### 1. ¿Necesitas etiqueta flotante compacta para formularios densos o búsquedas?
 * - **SÍ** → `variant="floating"`
 * - **NO** → ¿Es una búsqueda de entidades con autocompletado y catálogo?
 *   - **SÍ** → `variant="lookup"`
 *   - **NO** → `variant="outline"` (estándar por defecto) o `variant="filled"` / `variant="flushed"`
 * 
 * ### 2. ¿Qué modo de etiqueta (`labelMode`) seleccionar?
 * - Formulario estándar con múltiples campos → `labelMode="external"` (default)
 * - Campo aislado, modal compacto o estética moderna → `labelMode="floating"`
 * - Entrada compacta donde el placeholder guía → `labelMode="placeholder"`
 * - Entradas con accesibilidad visual oculta → `labelMode="hidden"`
 * 
 * ### 3. ¿Qué tipo (`type`) elegir?
 * - Correo electrónico → `type="email"` (icono Mail automático + validación + clear)
 * - Contraseña → `type="password"` (icono Lock + toggle visibilidad con target >= 44px)
 * - Búsqueda → `type="search"` (icono Search + clear)
 * - Teléfono → `type="tel"` (icono Phone + formateo en tiempo real)
 * - Número → `type="number"` (stepper interactivo +/- con target >= 44px)
 * - Enlace web → `type="url"` (icono Globe + validación)
 * - Fecha → `type="date"` (icono Calendar)
 * - Texto libre → `type="text"`
 */
const meta = {
  title: '4-Inputs/Input (Unificado)',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed', 'borderless', 'underline', 'floating', 'lookup'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning', 'info'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'date'],
    },
  },
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. María García',
    fullWidth: true,
    size: 'md',
    variant: 'outline',
    status: 'default',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variantes: Story = {
  name: 'Variantes: Outline, Filled, Flushed, Floating',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input variant="outline" label="Variante Outline (Estándar)" placeholder="Borde clásico 360°" />
      <Input variant="filled" label="Variante Filled" placeholder="Fondo gris sutil" />
      <Input variant="flushed" label="Variante Flushed" placeholder="Borde inferior únicamente" />
      <Input
        variant="floating"
        label="Variante Floating"
        tooltip="La etiqueta asciende suavemente al enfocar o contener valor"
        defaultValue="Texto con etiqueta elevada"
      />
    </div>
  ),
}

export const EscalaDeTamanios: Story = {
  name: 'Escala de Tamaños: SM, MD, LG, XL',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input size="sm" label="Pequeño (sm: 32px)" placeholder="Tablas densas y filtros" />
      <Input size="md" label="Mediano (md: 36px - default)" placeholder="Formularios estándar" />
      <Input size="lg" label="Grande (lg: 40px)" placeholder="Formularios destacados" />
      <Input size="xl" label="Extra Grande (xl: 48px)" placeholder="Hero sections y CTAs" />
    </div>
  ),
}

export const EstadosVisuales: Story = {
  name: 'Estados Visuales con Iconos Internos y ARIA',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input label="Estado: Por Defecto" placeholder="Estado neutro" />
      <Input
        label="Estado: Éxito"
        status="success"
        defaultValue="registro_valido"
        description="Nombre de usuario verificado y disponible"
      />
      <Input
        label="Estado: Advertencia"
        status="warning"
        defaultValue="contrasenia_debil"
        description="Se sugiere incluir caracteres especiales"
      />
      <Input
        label="Estado: Error"
        status="error"
        defaultValue="correo_sin_arroba"
        error="Ingresa una dirección de correo válida"
      />
      <Input label="Estado: Deshabilitado" disabled defaultValue="Valor bloqueado por permisos" />
      <Input label="Estado: Solo Lectura" readOnly defaultValue="Solo lectura (inmutable)" />
    </div>
  ),
}

export const ComportamientosPorTipo: Story = {
  name: 'Comportamientos Automáticos por Tipo',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input type="email" label="Correo Electrónico" defaultValue="contacto@farutech.com" />
      <Input type="password" label="Contraseña" defaultValue="MiPassword123!" />
      <Input type="search" label="Búsqueda" defaultValue="Productos destacados" />
      <Input type="tel" label="Teléfono (Autoformateo)" defaultValue="3001234567" />
      <Input type="number" label="Número con Stepper" defaultValue="15" showStepper min={0} max={100} />
      <Input type="url" label="Sitio Web" defaultValue="https://farutech.com" />
      <Input type="date" label="Fecha" />
    </div>
  ),
}

export const VarianteLookup: Story = {
  name: 'Variante Lookup (Búsqueda de Catálogo)',
  render: () => (
    <div style={{ width: '440px' }}>
      <Input
        variant="lookup"
        label="Buscar Cliente / Proveedor"
        onSearch={async (query) => [
          { value: '1', label: `Cliente ${query} Bogotá`, description: 'NIT 900.555.123' },
          { value: '2', label: `Distribuidor ${query} Medellín`, description: 'NIT 890.333.444' },
          { value: '3', label: `Sucursal ${query} Cali`, description: 'NIT 800.111.222' },
        ]}
        onAdvancedSearch={() => alert('Abriendo búsqueda avanzada modal...')}
        advancedSearchLabel="Búsqueda avanzada de clientes"
      />
    </div>
  ),
}

export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  args: {
    label: 'Nombre de usuario',
    placeholder: 'Escribe tu usuario',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /nombre de usuario/i })
    await userEvent.type(input, 'farutech_admin')
    await expect(input).toHaveValue('farutech_admin')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y Validación ARIA',
  args: {
    label: 'Correo corporativo',
    placeholder: 'admin@farutech.com',
    error: 'El formato del correo es inválido',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /correo corporativo/i })
    await expect(input).toBeInTheDocument()
    await expect(canvas.getByText(/el formato del correo es inválido/i)).toBeInTheDocument()
  },
}
