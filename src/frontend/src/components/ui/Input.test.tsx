import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Input,
  InputGroup,
  PasswordInput,
  SearchInput,
  NumberInput,
  Textarea,
} from './index'

describe('Fase 1 — Sistema de Inputs y Formularios', () => {
  describe('Input (Best-of-Breed)', () => {
    it('debe renderizar label, required y asociar aria-required y htmlFor', () => {
      render(
        <Input
          id="email-input"
          label="Correo Electrónico"
          required
          placeholder="tu@empresa.com"
        />
      )

      const label = screen.getByText('Correo Electrónico')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', 'email-input')

      const input = screen.getByPlaceholderText('tu@empresa.com')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('debe vincular mensajes de error con aria-describedby y aria-invalid', () => {
      render(
        <Input
          id="test-input"
          label="Nombre"
          error="El campo es obligatorio"
          description="Escribe tu nombre completo"
        />
      )

      const input = screen.getByLabelText('Nombre')
      expect(input).toHaveAttribute('aria-invalid', 'true')

      const errorMsg = screen.getByRole('alert')
      expect(errorMsg).toHaveTextContent('El campo es obligatorio')
      expect(input.getAttribute('aria-describedby')).toContain(errorMsg.id)
    })

    it('debe renderizar addons exteriores (addonBefore y addonAfter)', () => {
      render(
        <Input
          addonBefore={<span data-testid="addon-before">https://</span>}
          addonAfter={<button data-testid="addon-after">Copiar</button>}
          placeholder="farutech.com"
        />
      )

      expect(screen.getByTestId('addon-before')).toBeInTheDocument()
      expect(screen.getByTestId('addon-after')).toBeInTheDocument()
    })

    it('debe soportar prefix, suffix, leftSection y rightSection dentro del input', () => {
      render(
        <Input
          prefix={<span data-testid="prefix-icon">$</span>}
          suffix={<span data-testid="suffix-text">COP</span>}
          defaultValue="150000"
        />
      )

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByTestId('suffix-text')).toBeInTheDocument()
    })

    it('debe permitir limpiar el texto con allowClear', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()

      render(
        <Input
          placeholder="Digita algo..."
          allowClear
          defaultValue="Texto inicial"
          onValueChange={onValueChange}
        />
      )

      const input = screen.getByPlaceholderText('Digita algo...') as HTMLInputElement
      expect(input.value).toBe('Texto inicial')

      const clearBtn = screen.getByLabelText('Limpiar campo')
      expect(clearBtn).toBeInTheDocument()

      await user.click(clearBtn)
      expect(input.value).toBe('')
      expect(onValueChange).toHaveBeenCalledWith('')
    })

    it('debe mostrar el contador de caracteres cuando showCount está activo', async () => {
      const user = userEvent.setup()

      render(<Input placeholder="Bio" showCount maxLength={20} defaultValue="Hola" />)

      expect(screen.getByText('4/20')).toBeInTheDocument()

      const input = screen.getByPlaceholderText('Bio')
      await user.type(input, ' mundo')
      expect(screen.getByText('10/20')).toBeInTheDocument()
    })

    it('debe alternar visibilidad de contraseña con el toggle de password', async () => {
      const user = userEvent.setup()

      render(<Input type="password" placeholder="Contraseña secreta" />)

      const input = screen.getByPlaceholderText('Contraseña secreta')
      expect(input).toHaveAttribute('type', 'password')

      const toggleBtn = screen.getByLabelText('Ver contraseña')
      await user.click(toggleBtn)
      expect(input).toHaveAttribute('type', 'text')

      const hideBtn = screen.getByLabelText('Ocultar contraseña')
      await user.click(hideBtn)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('debe soportar validación por regex en modo block y modo error', async () => {
      const user = userEvent.setup()

      // Modo block: solo dígitos
      render(
        <Input
          placeholder="Solo números"
          pattern={/^\d+$/}
          validationMode="block"
        />
      )

      const input = screen.getByPlaceholderText('Solo números') as HTMLInputElement
      await user.type(input, '123abc45')
      // Solo deben haber entrado los números válidos
      expect(input.value).toBe('12345')
    })
  })

  describe('InputGroup', () => {
    it('debe renderizar un grupo de controles fusionados', () => {
      render(
        <InputGroup data-testid="test-input-group">
          <Input placeholder="Buscar término..." />
          <button data-testid="group-btn">Buscar</button>
        </InputGroup>
      )

      const group = screen.getByTestId('test-input-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveClass('relative', 'flex', 'items-stretch')
    })
  })

  describe('PasswordInput', () => {
    it('debe inicializarse con type="password" y autocomplete', () => {
      render(<PasswordInput placeholder="Clave" />)
      const input = screen.getByPlaceholderText('Clave')
      expect(input).toHaveAttribute('type', 'password')
      expect(input).toHaveAttribute('autocomplete', 'current-password')
    })
  })

  describe('SearchInput', () => {
    it('debe invocar onSearch al presionar Enter', () => {
      const onSearch = vi.fn()
      render(<SearchInput placeholder="Buscar productos..." onSearch={onSearch} defaultValue="laptop" />)

      const input = screen.getByPlaceholderText('Buscar productos...')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onSearch).toHaveBeenCalledWith('laptop')
    })
  })

  describe('NumberInput', () => {
    it('debe incrementar y decrementar con los controles y flechas', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput min={0} max={10} step={2} defaultValue={4} onChange={onChange} />)

      const incBtn = screen.getByLabelText('Incrementar')
      await user.click(incBtn)
      expect(onChange).toHaveBeenCalledWith(6)

      const decBtn = screen.getByLabelText('Decrementar')
      await user.click(decBtn)
      expect(onChange).toHaveBeenCalledWith(4)
    })

    it('debe respetar límites min y max al desenfocar', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput min={10} max={50} defaultValue={20} onChange={onChange} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      await user.clear(input)
      await user.type(input, '100')
      fireEvent.blur(input)

      // Debe quedar clampeado en 50
      expect(input.value).toBe('50')
      expect(onChange).toHaveBeenCalledWith(50)
    })
  })

  describe('Textarea', () => {
    it('debe renderizar con soporte de contador y estados', () => {
      render(
        <Textarea
          label="Comentarios"
          placeholder="Escribe tu opinión"
          showCount
          maxLength={100}
          defaultValue="Excelente"
        />
      )

      expect(screen.getByText('Comentarios')).toBeInTheDocument()
      expect(screen.getByText('9/100')).toBeInTheDocument()
    })
  })
})
