import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircularProgress } from '@/components/ui/CircularProgress'

/**
 * # CircularProgress - Anillos Métricos y Progreso Circular
 * 
 * Componente nativo SVG de cero dependencias para dashboards, KPIs, avance de tareas y spinners:
 * - Determinante (porcentajes de 0 a 100)
 * - Indeterminado (rotación continua para cargas de fondo)
 * - Tamaños predefinidos ('xs', 'sm', 'md', 'lg', 'xl') o diámetros exactos
 * - Colores semánticos ('primary', 'success', 'warning', 'error', 'info')
 */
const meta: Meta<typeof CircularProgress> = {
  title: 'Feedback/CircularProgress',
  component: CircularProgress,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Valor del progreso (0 a max)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño predeterminado o diámetro en px',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info'],
      description: 'Color temático del anillo',
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Grosor del trazo en píxeles',
    },
    showValue: {
      control: 'boolean',
      description: 'Mostrar texto con el porcentaje en el centro',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Animación continua de carga',
    },
    label: {
      control: 'text',
      description: 'Etiqueta descriptiva inferior',
    },
  },
  args: {
    value: 72,
    size: 'md',
    color: 'primary',
    showValue: true,
    indeterminate: false,
    label: 'Avance de Sincronización',
  },
}

export default meta

export const Default: StoryObj<typeof CircularProgress> = {
  name: '1. Control Interactivo (Playground)',
  render: (args) => (
    <div className="p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <CircularProgress {...args} />
    </div>
  ),
}

export const AllSizes: StoryObj = {
  name: '2. Escala de Tamaños (xs a xl)',
  render: () => (
    <div className="p-8 flex items-end gap-8 flex-wrap bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <CircularProgress size="xs" value={45} showValue label="xs (32px)" />
      <CircularProgress size="sm" value={60} showValue label="sm (48px)" />
      <CircularProgress size="md" value={75} showValue label="md (64px)" />
      <CircularProgress size="lg" value={90} showValue label="lg (96px)" />
      <CircularProgress size="xl" value={100} showValue label="xl (128px)" />
    </div>
  ),
}

export const SemanticColors: StoryObj = {
  name: '3. Colores Semánticos',
  render: () => (
    <div className="p-8 flex items-center gap-8 flex-wrap bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <CircularProgress value={78} color="primary" showValue label="Primary" />
      <CircularProgress value={94} color="success" showValue label="Success" />
      <CircularProgress value={52} color="warning" showValue label="Warning" />
      <CircularProgress value={25} color="error" showValue label="Error" />
      <CircularProgress value={63} color="info" showValue label="Info" />
    </div>
  ),
}

export const DashboardKpiCard: StoryObj = {
  name: '4. Tarjetas Dashboard / Métrica KPI',
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
      <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cumplimiento SLA</span>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">98.4%</h4>
          <span className="text-xs text-emerald-600 font-medium">+2.1% vs mes anterior</span>
        </div>
        <CircularProgress value={98} color="success" size="sm" showValue />
      </div>

      <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacidad Disco</span>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">84%</h4>
          <span className="text-xs text-amber-600 font-medium">128 GB disponibles</span>
        </div>
        <CircularProgress value={84} color="warning" size="sm" showValue />
      </div>

      <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Procesamiento</span>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Sincronizando</h4>
          <span className="text-xs text-gray-400 font-medium">Lote de nómina #490</span>
        </div>
        <CircularProgress indeterminate color="primary" size="sm" />
      </div>
    </div>
  ),
}
