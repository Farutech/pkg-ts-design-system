import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BulkActionsBar } from '@/components/ui/BulkActionsBar'

const meta: Meta<typeof BulkActionsBar> = {
  title: 'Components/DataDisplay/BulkActionsBar',
  component: BulkActionsBar,
}
export default meta

export const Default: StoryObj<typeof BulkActionsBar> = {
  render: () => {
    const [count, setCount] = useState(3)
    return (
      <div className="max-w-xl p-8 bg-gray-50 dark:bg-gray-900 min-h-[160px] rounded-xl relative">
        <BulkActionsBar
          selectedCount={count}
          onClearSelection={() => setCount(0)}
          actions={[
            { id: 'approve', label: 'Aprobar Solicitudes', onClick: () => alert('Aprobadas'), variant: 'primary' },
            { id: 'export', label: 'Exportar Lote', onClick: () => alert('Exportando') },
            { id: 'delete', label: 'Eliminar', onClick: () => setCount(0), variant: 'danger' },
          ]}
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
