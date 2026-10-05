import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchInput } from '@/components/ui/SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Inputs/SearchInput',
  component: SearchInput,
}
export default meta

export const Default: StoryObj<typeof SearchInput> = {
  render: () => {
    const [query, setQuery] = useState('')
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <SearchInput
          placeholder="Buscar herramientas, órdenes o clientes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={(q) => alert('Buscando: ' + q)}
        />
        <p className="text-xs text-gray-500 font-mono">Query: {query || 'Vacío'}</p>
      </div>
    )
  },
}
