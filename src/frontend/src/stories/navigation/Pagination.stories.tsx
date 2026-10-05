import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '@/components/ui/Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
}
export default meta

export const Default: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="max-w-xl p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <Pagination
          page={page}
          totalPages={10}
          onChange={setPage}
        />
        <p className="text-xs text-gray-500 font-mono">Página activa: {page}</p>
      </div>
    )
  },
}
