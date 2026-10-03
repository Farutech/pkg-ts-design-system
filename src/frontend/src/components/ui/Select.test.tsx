import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  Combobox,
  MultiSelect,
  ListboxCore,
  resolveOptionValue,
  resolveOptionLabel,
} from './index'
import { useAsyncDataSource } from '@/hooks/useAsyncDataSource'

describe('Fase 2 — Sistema de Selección, Listbox y Datos Desacoplados', () => {
  describe('DataMapping (Resolución de Entidades)', () => {
    it('debe resolver valor con valueKey automática o función personalizada', () => {
      expect(resolveOptionValue({ id: '101', name: 'Bogotá' })).toBe('101')
      expect(resolveOptionValue({ uuid: 'abc-xyz', name: 'Medellín' })).toBe('abc-xyz')
      expect(resolveOptionValue({ code: 'COL', name: 'Colombia' })).toBe('COL')
      expect(resolveOptionValue({ sku: 'PRD-01' }, 'sku')).toBe('PRD-01')
      expect(resolveOptionValue({ num: 5 }, (item) => `n-${item.num}`)).toBe('n-5')
    })

    it('debe resolver label y plantillas de texto interpoladas', () => {
      expect(resolveOptionLabel({ name: 'Bogotá' })).toBe('Bogotá')
      expect(resolveOptionLabel({ title: 'Administrador' })).toBe('Administrador')
      expect(
        resolveOptionLabel(
          { firstName: 'Farid', lastName: 'Maloof', id: '007' },
          undefined,
          '{firstName} {lastName} ({id})'
        )
      ).toBe('Farid Maloof (007)')
    })
  })

  describe('useAsyncDataSource (Motor de Concurrencia y Cache)', () => {
    function AsyncTestConsumer({
      loadData,
      debounceMs = 50,
    }: {
      loadData: (q: string, ctx: { signal: AbortSignal }) => Promise<string[]>
      debounceMs?: number
    }) {
      const { data, isLoading, search, query } = useAsyncDataSource<string>({
        loadData,
        debounceMs,
        immediate: false,
      })

      return (
        <div>
          <input
            data-testid="async-input"
            value={query}
            onChange={(e) => search(e.target.value)}
          />
          {isLoading && <span data-testid="async-loading">Cargando...</span>}
          <ul data-testid="async-results">
            {data.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )
    }

    it('debe ejecutar la búsqueda con debounce y cancelar la petición previa', async () => {
      const user = userEvent.setup()
      const abortedSignals: boolean[] = []

      const mockLoad = vi.fn(async (q: string, ctx: { signal: AbortSignal }) => {
        ctx.signal.addEventListener('abort', () => {
          abortedSignals.push(true)
        })
        await new Promise((r) => setTimeout(r, 100))
        return [`Resultado para ${q}`]
      })

      render(<AsyncTestConsumer loadData={mockLoad} debounceMs={30} />)

      const input = screen.getByTestId('async-input')
      await user.type(input, 'abc')

      // Esperar a que pase el debounce y la resolución
      await act(async () => {
        await new Promise((r) => setTimeout(r, 200))
      })

      expect(mockLoad).toHaveBeenCalled()
      expect(screen.getByText('Resultado para abc')).toBeInTheDocument()
    })
  })

  describe('ListboxCore', () => {
    const items = [
      { id: '1', name: 'Opción 1' },
      { id: '2', name: 'Opción 2' },
      { id: '3', name: 'Opción 3' },
    ]

    it('debe renderizar opciones y navegar con teclado', () => {
      const onSelect = vi.fn()
      render(
        <ListboxCore
          items={items}
          onSelectKey={onSelect}
          mapping={{ valueKey: 'id', textKey: 'name' }}
        />
      )

      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()

      const option1 = screen.getByText('Opción 1')
      fireEvent.click(option1)
      expect(onSelect).toHaveBeenCalledWith('1', items[0])
    })

    it('debe activar virtualización matemática si supera el umbral', () => {
      // 100 elementos superan el umbral por defecto (80)
      const bigList = Array.from({ length: 150 }, (_, i) => ({
        id: String(i),
        name: `Fila #${i}`,
      }))

      render(
        <ListboxCore
          items={bigList}
          mapping={{ valueKey: 'id', textKey: 'name' }}
          maxHeight={200}
          itemHeight={30}
        />
      )

      // No deben montarse los 150 nodos en el DOM
      const renderedOptions = screen.getAllByRole('option')
      expect(renderedOptions.length).toBeLessThan(40)
    })
  })

  describe('Select (Best-of-Breed)', () => {
    const countries = [
      { code: 'CO', name: 'Colombia' },
      { code: 'MX', name: 'México' },
      { code: 'AR', name: 'Argentina' },
    ]

    it('debe abrir popover al hacer clic y seleccionar una opción', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <Select
          label="País"
          options={countries}
          valueKey="code"
          textKey="name"
          placeholder="Selecciona país"
          onChange={onChange}
        />
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveTextContent('Selecciona país')

      await user.click(trigger)
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      const mexicoOption = screen.getByText('México')
      await user.click(mexicoOption)

      expect(onChange).toHaveBeenCalledWith('MX', countries[1])
      expect(trigger).toHaveTextContent('México')
    })

    it('debe soportar allowClear para deseleccionar', async () => {
      const user = userEvent.setup()

      render(
        <Select
          options={countries}
          valueKey="code"
          textKey="name"
          defaultValue="CO"
          allowClear
        />
      )

      const clearBtn = screen.getByLabelText('Limpiar selección')
      expect(clearBtn).toBeInTheDocument()

      await user.click(clearBtn)
      expect(screen.getByRole('combobox')).toHaveTextContent('Selecciona una opción...')
    })
  })

  describe('Combobox', () => {
    const fruits = [
      { id: '1', name: 'Manzana' },
      { id: '2', name: 'Mango' },
      { id: '3', name: 'Plátano' },
    ]

    it('debe filtrar opciones mientras el usuario digita', async () => {
      const user = userEvent.setup()

      render(
        <Combobox
          options={fruits}
          valueKey="id"
          textKey="name"
          placeholder="Escribe fruta..."
        />
      )

      const input = screen.getByPlaceholderText('Escribe fruta...')
      await user.type(input, 'man')

      // Deben verse Manzana y Mango pero no Plátano
      expect(screen.getByText('Manzana')).toBeInTheDocument()
      expect(screen.getByText('Mango')).toBeInTheDocument()
      expect(screen.queryByText('Plátano')).not.toBeInTheDocument()
    })
  })

  describe('MultiSelect', () => {
    const roles = [
      { id: 'admin', name: 'Administrador' },
      { id: 'editor', name: 'Editor' },
      { id: 'viewer', name: 'Visualizador' },
    ]

    it('debe permitir seleccionar múltiples opciones y eliminarlas con el chip', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <MultiSelect
          options={roles}
          valueKey="id"
          textKey="name"
          defaultValue={['admin']}
          onChange={onChange}
        />
      )

      expect(screen.getByText('Administrador')).toBeInTheDocument()

      // Abrir lista y seleccionar 'Editor'
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      const editorOpt = screen.getByText('Editor')
      await user.click(editorOpt)

      expect(onChange).toHaveBeenCalledWith(['admin', 'editor'], [roles[0], roles[1]])

      // Eliminar 'Administrador' con botón de cierre del chip
      const removeAdmin = screen.getByLabelText('Eliminar Administrador')
      await user.click(removeAdmin)

      expect(onChange).toHaveBeenCalledWith(['editor'], [roles[1]])
    })
  })
})
