import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Input,
  InputGroup,
  PasswordInput,
  SearchInput,
  NumberInput,
  Textarea,
  Button,
  Icon,
} from '@/index'

const meta: Meta = {
  title: 'Components/Inputs (Best-of-Breed)',
  parameters: {
    docs: {
      description: {
        component:
          'Familia completa de entradas de texto de pkg-ts-design-system 1.0.1, unificando los patrones de Bootstrap (addons), Ant Design (prefix/suffix/allowClear/showCount), Mantine (left/rightSection), MUI (adornments) y React Aria (accesibilidad).',
      },
    },
  },
}

export default meta

export const AllAddonsAndAdornments: StoryObj = {
  render: () => {
    const [price, setPrice] = useState('250000')

    return (
      <div className="flex flex-col gap-6 max-w-xl p-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Input con Addons Exteriores y Secciones Internas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Los botones y acciones integrados en <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">addonBefore</code> o <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">addonAfter</code> se acoplan armónicamente al 100% de altura, eliminando cajas dobles y desalineaciones visuales, con retroalimentación hover interactiva.
          </p>
        </div>

        <Input
          label="Precio del Producto"
          description="Precio unitario con moneda e impuestos"
          required
          addonBefore={<span className="font-mono text-xs">COP</span>}
          addonAfter={
            <Button
              size="sm"
              variant="addon"
              onClick={() => alert('Tasa de cambio recalculada exitosamente')}
              title="Recalcular tasa de cambio"
            >
              Aplicar Tasa
            </Button>
          }
          prefix={<Icon.Search size="sm" />}
          suffix={<span className="text-xs text-gray-400">IVA incl.</span>}
          value={price}
          onValueChange={setPrice}
          allowClear
          showCount
          maxLength={12}
        />

        <Input
          label="URL del Repositorio"
          addonBefore="https://github.com/"
          addonAfter={
            <Button
              size="sm"
              variant="addon"
              icon={<Icon.ExternalLink size="sm" />}
              title="Abrir repositorio en nueva pestaña"
              onClick={() => window.open('https://github.com/Farutech/pkg-ts-design-system', '_blank')}
            />
          }
          placeholder="Farutech/pkg-ts-design-system"
        />

        <Input
          label="Búsqueda Rápida (Botón Primario Acoplado)"
          placeholder="Nombre, NIT o documento..."
          addonAfter={
            <Button
              size="sm"
              variant="primary"
              onClick={() => alert('Búsqueda ejecutada')}
            >
              Buscar
            </Button>
          }
        />
      </div>
    )
  },
}

export const InputGroupShowcase: StoryObj = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 max-w-xl p-4">
        <h3 className="font-bold text-lg">InputGroup con Bordes Fusionados y Anillo de Foco</h3>
        <p className="text-sm text-gray-500">
          Los componentes adyacentes fusionan sus radios de curvatura automáticamente y coordinan el anillo de foco (`focus-within`).
        </p>

        <InputGroup>
          <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm rounded-l-md">
            @
          </span>
          <Input placeholder="nombre_usuario" />
          <Button variant="primary">Verificar</Button>
        </InputGroup>

        <InputGroup>
          <SearchInput placeholder="Buscar transacciones..." />
          <Button variant="secondary">Filtros</Button>
          <Button variant="primary">Buscar</Button>
        </InputGroup>
      </div>
    )
  },
}

export const SpecializedInputs: StoryObj = {
  render: () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl p-4">
        <PasswordInput
          label="Contraseña"
          placeholder="Ingresa tu clave de acceso"
          description="Mínimo 8 caracteres"
          required
        />

        <SearchInput
          label="Búsqueda Rápida"
          placeholder="Filtrar por nombre o SKU..."
          onSearch={(query) => alert(`Buscando: ${query}`)}
        />

        <NumberInput
          label="Cantidad"
          min={1}
          max={100}
          step={5}
          defaultValue={10}
          description="Incrementos de 5 en 5"
        />

        <Textarea
          label="Notas Adicionales"
          placeholder="Escribe comentarios..."
          showCount
          maxLength={150}
          defaultValue="Aprobado para despacho"
        />
      </div>
    )
  },
}

export const ValidationAndStates: StoryObj = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 max-w-md p-4">
        <Input
          label="Estado: Error"
          error="El formato de correo no es válido"
          defaultValue="correo_invalido"
        />

        <Input
          label="Estado: Éxito"
          status="success"
          defaultValue="usuario_disponible"
          description="Nombre de usuario disponible para registro"
          suffix={<Icon.Check size="sm" className="text-emerald-500" />}
        />

        <Input
          label="Estado: Deshabilitado"
          disabled
          defaultValue="Valor bloqueado por permisos"
        />
      </div>
    )
  },
}
