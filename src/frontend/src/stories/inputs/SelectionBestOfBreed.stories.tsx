import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  Combobox,
  RemoteSelect,
  MultiSelect,
  ListboxCore,
} from '@/index'

const meta: Meta = {
  title: 'Components/Select & Listbox (Fase 2)',
  parameters: {
    docs: {
      description: {
        component:
          'Primitiva universal ListboxCore, motor asíncrono useAsyncDataSource con cancelación AbortController, y selectores desacoplados con soporte declarativo de DataMappingProps (valueKey, textKey, textTemplate, renderOption).',
      },
    },
  },
}

export default meta

interface Employee {
  id: string
  name: string
  role: string
  department: string
}

const employees: Employee[] = [
  { id: 'emp-1', name: 'Farid Maloof', role: 'Architect', department: 'Engineering' },
  { id: 'emp-2', name: 'Laura Gómez', role: 'Lead Designer', department: 'Product' },
  { id: 'emp-3', name: 'Carlos Pérez', role: 'DevOps Senior', department: 'Infrastructure' },
  { id: 'emp-4', name: 'Ana Torres', role: 'QA Lead', department: 'Quality' },
  { id: 'emp-5', name: 'Mateo Restrepo', role: 'Frontend Engineer', department: 'Engineering' },
]

export const SelectWithDataMapping: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('emp-1')

    return (
      <div className="flex flex-col gap-6 max-w-md p-4">
        <h3 className="font-bold text-lg">Select con Mapeo Desacoplado y Plantillas</h3>
        <p className="text-sm text-gray-500">
          No requiere transformar entidades a &#123; value, label &#125;. Se declara <code>valueKey="id"</code> y <code>textTemplate="&#123;name&#125; — &#123;role&#125; (&#123;department&#125;)"</code>.
        </p>

        <Select<Employee>
          label="Responsable del Proyecto"
          options={employees}
          valueKey="id"
          textTemplate="{name} — {role} ({department})"
          value={selected}
          onChange={(val: any) => setSelected(String(val))}
          allowClear
        />

        <div className="text-xs font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
          Valor seleccionado: {selected || 'Ninguno'}
        </div>
      </div>
    )
  },
}

export const ComboboxFilterable: StoryObj = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 max-w-md p-4">
        <h3 className="font-bold text-lg">Combobox con Filtro en Vivo</h3>
        <Combobox<Employee>
          label="Buscar Colaborador"
          placeholder="Digita nombre, cargo o depto..."
          options={employees}
          valueKey="id"
          textTemplate="{name} ({role})"
        />
      </div>
    )
  },
}

export const RemoteSelectAsync: StoryObj = {
  render: () => {
    // Simular API remota con latencia
    const fetchUsersApi = async (query: string, { signal }: { signal: AbortSignal }): Promise<Employee[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (signal.aborted) throw new Error('Aborted')

      if (!query.trim()) return employees
      const q = query.toLowerCase()
      return employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      )
    }

    return (
      <div className="flex flex-col gap-6 max-w-md p-4">
        <h3 className="font-bold text-lg">RemoteSelect con Cancelación y Debounce</h3>
        <p className="text-sm text-gray-500">
          Usa <code>useAsyncDataSource</code> con AbortSignal para descartar peticiones obsoletas y evitar condiciones de carrera.
        </p>

        <RemoteSelect<Employee>
          label="Búsqueda Remota de Empleados"
          loadOptions={fetchUsersApi}
          valueKey="id"
          textTemplate="{name} ({department})"
          placeholder="Seleccionar..."
          searchPlaceholder="Escribe para consultar API..."
        />
      </div>
    )
  },
}

export const MultiSelectWithChips: StoryObj = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(['emp-1', 'emp-2'])

    return (
      <div className="flex flex-col gap-6 max-w-lg p-4">
        <h3 className="font-bold text-lg">MultiSelect con Tags Interactivas</h3>

        <MultiSelect<Employee>
          label="Equipo Asignado"
          options={employees}
          valueKey="id"
          textKey="name"
          value={selectedIds}
          onChange={(newIds) => setSelectedIds(newIds)}
          placeholder="Añadir miembros..."
        />

        <div className="text-xs font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
          IDs seleccionados: {JSON.stringify(selectedIds)}
        </div>
      </div>
    )
  },
}

export const VirtualizedLargeDataset: StoryObj = {
  render: () => {
    // 2,500 elementos para probar virtualización transparente
    const largeCatalog = Array.from({ length: 2500 }, (_, i) => ({
      sku: `SKU-${10000 + i}`,
      title: `Producto Farmacéutico o Insumo #${i + 1}`,
      price: (15 + (i % 80) * 1.5).toFixed(2),
    }))

    return (
      <div className="flex flex-col gap-6 max-w-md p-4">
        <h3 className="font-bold text-lg">ListboxCore con 2.500 Elementos Virtualizados</h3>
        <p className="text-sm text-gray-500">
          El motor de ventana matemática renderiza únicamente los nodos visibles en el viewport + buffer. Rendimiento continuo a 60 FPS.
        </p>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-1 bg-white dark:bg-gray-900 shadow-sm">
          <ListboxCore
            items={largeCatalog}
            mapping={{
              valueKey: 'sku',
              textKey: 'title',
              renderOption: (item, { selected: _selected, active: _active }) => (
                <div className="flex items-center justify-between w-full text-xs">
                  <span className="font-mono text-gray-500">{item.sku}</span>
                  <span className="truncate max-w-[180px] font-medium">{item.title}</span>
                  <span className="font-semibold text-emerald-600">${item.price}</span>
                </div>
              ),
            }}
            maxHeight={280}
            itemHeight={34}
            onSelectKey={(sku, item) => alert(`Seleccionado: ${sku} - ${item.title}`)}
          />
        </div>
      </div>
    )
  },
}
