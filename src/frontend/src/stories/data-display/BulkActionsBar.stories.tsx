import React, { useState } from 'react'
import type { Meta } from '@storybook/react-vite'
import { BulkActionsBar } from '@/components/ui/BulkActionsBar'

const meta: Meta = {
  title: '5-Data Display/BulkActionsBar',
  component: BulkActionsBar,
  tags: ['autodocs'],
  argTypes: {
    selectedCount: { control: 'number', description: 'Número de elementos seleccionados' },
    onClearSelection: { action: 'cleared' },
    actions: { control: 'object', description: 'Lista de acciones disponibles' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barra de acciones masivas para selección múltiple de elementos.',
      },
    },
  },
}
export default meta

export const Default = {
  args: {
    selectedCount: 3,
    actions: [
      { id: 'approve', label: 'Aprobar Solicitudes', onClick: () => alert('Aprobadas'), variant: 'primary' },
      { id: 'export', label: 'Exportar Lote', onClick: () => alert('Exportando') },
      { id: 'delete', label: 'Eliminar', onClick: () => {}, variant: 'danger' },
    ],
  },
  render: (args: any) => {
    const [count, setCount] = useState(args.selectedCount)
    return (
      <div className="max-w-xl p-8 bg-gray-50 dark:bg-gray-900 min-h-[160px] rounded-xl relative">
        <BulkActionsBar
          selectedCount={count}
          onClearSelection={() => setCount(0)}
          actions={args.actions.map((a: any) => ({ ...a, onClick: a.onClick ? () => a.onClick() : undefined }))}
        />
        {count === 0 && (
          <button
            onClick={() => setCount(3)}
            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs"
          >
            Simular 3 elementos seleccionados
          </button>
        )}
      </div>
    )
  },
}
