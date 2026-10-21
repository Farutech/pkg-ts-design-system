import React from 'react'
import type { Meta } from '@storybook/react-vite'
import { Spinner } from '@/components/ui/Spinner'

const meta: Meta = {
  title: '6-Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['circle', 'dots', 'ring', 'dual-ring'] },
  },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Componentes de carga: `Spinner` con múltiples variantes y tamaños.' } },
  },
}
export default meta

export const Default = {
  args: { size: 'md', variant: 'circle' },
}

export const Variations = {
  name: 'Variantes de tamaño',
  render: () => (
    <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-900 rounded-xl">
      <div className="text-center space-y-2">
        <Spinner size="sm" />
        <span className="text-[10px] text-gray-400 block font-mono">Small</span>
      </div>
      <div className="text-center space-y-2">
        <Spinner size="md" />
        <span className="text-[10px] text-gray-400 block font-mono">Medium</span>
      </div>
      <div className="text-center space-y-2">
        <Spinner size="lg" />
        <span className="text-[10px] text-gray-400 block font-mono">Large</span>
      </div>
      <div className="text-center space-y-2">
        <Spinner size="xl" variant="dots" />
        <span className="text-[10px] text-gray-400 block font-mono">XL Dots</span>
      </div>
    </div>
  ),
}
