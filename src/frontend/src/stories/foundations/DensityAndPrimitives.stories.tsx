import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ConfigProvider,
  Icon,
  FocusTrap,
  type Density,
} from '@/index'

const meta: Meta = {
  title: 'Foundations/Cimiento y Densidad (Fase 0)',
  parameters: {
    docs: {
      description: {
        component:
          'Demostración de los pilares fundacionales de pkg-ts-design-system 1.0.1: sistema de densidad de datos (comfortable / compact / dense), iconos semánticos con adapters intercambiables, y primitivas headless de accesibilidad (FocusTrap, ClickOutside, Portal).',
      },
    },
  },
}

export default meta

export const DensityComparison: StoryObj = {
  render: () => {
    const densities: Density[] = ['comfortable', 'compact', 'dense']

    return (
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Comparativa de Densidad de Datos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Los 3 niveles de densidad estandarizados garantizan ergonomía táctil en interfaces públicas y máxima compacidad en aplicaciones data-heavy (ERP / Finanzas).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {densities.map((d) => (
            <ConfigProvider key={d} density={d}>
              <div
                className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 flex flex-col gap-4 shadow-sm"
                data-density={d}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold capitalize text-primary-600 dark:text-primary-400">
                    Modo: {d}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                    {d === 'comfortable' ? '56px / 44px' : d === 'compact' ? '44px / 36px' : '32px / 28px'}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Input simulado
                  </label>
                  <div
                    className="flex items-center px-3 border rounded border-gray-300 dark:border-gray-700 text-sm"
                    style={{ height: 'var(--ft-density-input-height)' }}
                  >
                    <span>Texto de ejemplo</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500">Fila de tabla</span>
                  <div
                    className="flex items-center justify-between px-3 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                    style={{ height: 'var(--ft-density-row-height)' }}
                  >
                    <span>Registro #1024</span>
                    <span className="font-mono text-xs">$1,250.00 COP</span>
                  </div>
                </div>
              </div>
            </ConfigProvider>
          ))}
        </div>
      </div>
    )
  },
}

export const SemanticIconsGallery: StoryObj = {
  render: () => {
    const iconNames = [
      'ChevronDown',
      'ChevronUp',
      'ChevronLeft',
      'ChevronRight',
      'Clear',
      'Close',
      'Eye',
      'EyeOff',
      'Search',
      'Spinner',
      'Check',
      'Warning',
      'Info',
      'Error',
      'Menu',
      'More',
      'Plus',
      'Minus',
      'Copy',
      'Filter',
      'Sort',
      'Calendar',
      'Clock',
      'User',
      'Trash',
      'Edit',
    ] as const

    return (
      <div className="p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Iconos Semánticos con Adapter Agnóstico
          </h2>
          <p className="text-sm text-gray-500">
            Uso declarativo: &lt;Icon.Search /&gt;, &lt;Icon.Clear /&gt;. El consumidor puede sustituir el adapter por Lucide o Phosphor sin tocar el código de los componentes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {iconNames.map((name) => {
            return (
              <div
                key={name}
                className="flex flex-col items-center justify-center p-3 border rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 gap-2 hover:border-primary-500 transition-colors"
              >
                <div className="text-gray-700 dark:text-gray-300">
                  <Icon name={name} size="md" />
                </div>
                <span className="text-xs text-gray-500 truncate max-w-full font-mono">
                  {name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}

export const InteractiveFocusTrap: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 flex flex-col items-start gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700"
        >
          Abrir Diálogo con FocusTrap
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <FocusTrap
              onEscape={() => setIsOpen(false)}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full flex flex-col gap-4 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Trampa de Foco Activa</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <Icon.Close size="sm" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Presiona <strong>Tab</strong> y <strong>Shift+Tab</strong> para ciclar entre los campos. Presiona <strong>Escape</strong> para cerrar y restaurar el foco al botón que lo abrió.
              </p>

              <input
                placeholder="Primer campo enfocable"
                className="border rounded px-3 py-2 text-sm w-full dark:bg-gray-800 dark:border-gray-700"
              />
              <input
                placeholder="Segundo campo"
                className="border rounded px-3 py-2 text-sm w-full dark:bg-gray-800 dark:border-gray-700"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                >
                  Aceptar
                </button>
              </div>
            </FocusTrap>
          </div>
        )}
      </div>
    )
  },
}
