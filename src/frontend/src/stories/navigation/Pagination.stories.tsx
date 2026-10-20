import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '@/components/ui/Pagination'

const meta: Meta<typeof Pagination> = {
  title: '3-Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number', description: 'Página actual' },
    totalPages: { control: 'number', description: 'Total de páginas' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  args: {
    page: 1,
    totalPages: 10,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Paginación numerada con controles de anterior/siguiente y selector de página.',
      },
    },
  },
}
export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    page: 1,
    totalPages: 10,
  },
  render: ({ page: initialPage, totalPages }) => {
    const [page, setPage] = useState(initialPage)
    return (
      <div className="max-w-xl p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
        <p className="text-xs text-gray-500 font-mono">Página activa: {page}</p>
      </div>
    )
  },
}
