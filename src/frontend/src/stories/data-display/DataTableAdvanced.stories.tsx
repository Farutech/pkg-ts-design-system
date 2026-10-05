import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from '@/components/ui/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  color: string
  stock: number
  price: number
}

const mockProducts: Product[] = [
  { id: '1', name: 'Disco Sierra Circular 12" 96D', category: 'Cuchillas', brand: 'Freud Pro', color: 'Plata', stock: 13, price: 829.99 },
  { id: '2', name: 'Fresa Integral Metal Duro D16 Z4', category: 'Fresas', brand: 'Guhring', color: 'Titanio', stock: 12, price: 1419.99 },
  { id: '3', name: 'Cuchilla de Cepilladora HSS 300mm', category: 'Cuchillas', brand: 'Leitz', color: 'Negro', stock: 8, price: 999.99 },
  { id: '4', name: 'Broca de Centrado Carburo D6', category: 'Brocas', brand: 'Sandvik', color: 'Azul', stock: 3, price: 829.99 },
  { id: '5', name: 'Inserto Roscado TNMG 160408', category: 'Insertos', brand: 'Seco Tools', color: 'Blanco', stock: 9, price: 187.00 },
]

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-xs text-primary-600 dark:text-primary-400">
          ⚙
        </div>
        <div>
          <span className="font-semibold text-gray-900 dark:text-gray-100 block text-xs sm:text-sm">
            {row.original.name}
          </span>
          <span className="text-[11px] text-gray-400 font-mono">ID: #{row.original.id}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'color',
    header: 'Color',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.stock
      const isLow = stock <= 5
      return (
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="font-semibold text-xs">{stock}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        ${row.original.price.toFixed(2)}
      </span>
    ),
  },
]

const meta: Meta = {
  title: 'DataDisplay/DataTable (Best-of-Breed Showcase)',
  parameters: {
    docs: {
      description: {
        component: 'Demostración avanzada de DataTable con barra de exportación (Print, CSV, PDF, Excel), acciones de fila compactas (botones de colores y menú desplegable), filtros y paginación estilo CRUD Operations.',
      },
    },
  },
}
export default meta

export const ProductsCrudTable: StoryObj = {
  name: 'Tabla Avanzada con Botones de Fila, Export Tools y Filtros',
  render: () => {
    const [page, setPage] = useState(1)

    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Catálogo de Productos & Operaciones
            </h2>
            <p className="text-xs text-gray-500">
              Control de existencias, precios y acciones de mantenimiento
            </p>
          </div>
        </div>

        <DataTable
          data={mockProducts}
          columns={columns}
          searchable
          searchPlaceholder="Search products, brands or category..."
          selectable
          exportTools={['print', 'csv', 'pdf', 'excel']}
          actions={{
            displayMode: 'buttons',
            onView: (item) => alert('Ver: ' + item.name),
            onEdit: (item) => alert('Editar: ' + item.name),
            onDelete: (item) => alert('Eliminar: ' + item.name),
          }}
          pagination={{
            page,
            perPage: 5,
            total: 300,
            onPageChange: setPage,
          }}
        />
      </div>
    )
  },
}
