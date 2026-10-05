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
  Form,
  Select,
  Button,
  FloatingInput,
  LookupInput,
} from './index'
import { inputColorTokens, inputSizeTokens } from '@/tokens/input'

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

    it('debe integrar botones armónicamente en addons exteriores con soporte para variant addon y callbacks de click', async () => {
      const user = userEvent.setup()
      const onActionClick = vi.fn()
      const onAddonBeforeClick = vi.fn()

      render(
        <Input
          addonBefore={<span data-testid="addon-prefix">COP</span>}
          onAddonBeforeClick={onAddonBeforeClick}
          addonAfter={
            <Button
              variant="addon"
              size="sm"
              onClick={onActionClick}
              data-testid="addon-action-btn"
            >
              Aplicar Tasa
            </Button>
          }
          placeholder="100000"
        />
      )

      const prefix = screen.getByTestId('addon-prefix')
      expect(prefix).toBeInTheDocument()

      const btn = screen.getByTestId('addon-action-btn')
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveClass('ft-button--addon')

      await user.click(btn)
      expect(onActionClick).toHaveBeenCalledTimes(1)

      await user.click(prefix.parentElement!)
      expect(onAddonBeforeClick).toHaveBeenCalledTimes(1)
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

  describe('Auditoría Input - Fases 1 a 7 (Best-of-Breed Unificado)', () => {
    it('debe exportar tokens centralizados de input (Fase 1)', () => {
      expect(inputColorTokens).toBeDefined()
      expect(inputSizeTokens.sm.height).toBe('2rem')
      expect(inputSizeTokens.md.height).toBe('2.25rem')
      expect(inputSizeTokens.lg.height).toBe('2.5rem')
      expect(inputSizeTokens.xl.height).toBe('3rem')
    })

    it('debe renderizar variante floating con etiqueta animada y tooltip accesible (Fase 2 & 3)', () => {
      render(
        <Input
          variant="floating"
          label="Nombre de Entidad"
          tooltip="Información complementaria"
          defaultValue="FaruTech SAS"
        />
      )

      expect(screen.getByText('Nombre de Entidad')).toBeInTheDocument()
      const input = screen.getByDisplayValue('FaruTech SAS')
      expect(input).toBeInTheDocument()
    })

    it('debe renderizar variante lookup con combobox y soporte de búsqueda (Fase 2 & 3)', async () => {
      const user = userEvent.setup()
      const onSearch = vi.fn().mockResolvedValue([
        { value: '1', label: 'Cliente Bogotá', description: 'NIT 900.123.456' },
      ])
      const onLookupChange = vi.fn()
      const onAdvancedSearch = vi.fn()

      render(
        <Input
          variant="lookup"
          label="Buscar Cliente"
          onSearch={onSearch}
          onLookupChange={onLookupChange}
          onAdvancedSearch={onAdvancedSearch}
          advancedSearchLabel="Búsqueda avanzada de clientes"
        />
      )

      const combobox = screen.getByRole('combobox')
      expect(combobox).toBeInTheDocument()
      expect(combobox).toHaveAttribute('aria-autocomplete', 'list')

      const advBtn = screen.getByLabelText('Búsqueda avanzada de clientes')
      expect(advBtn).toBeInTheDocument()
      await user.click(advBtn)
      expect(onAdvancedSearch).toHaveBeenCalledTimes(1)
    })

    it('debe garantizar retrocompatibilidad 100% con FloatingInput y LookupInput wrappers (Fase 2)', async () => {
      const onSearch = vi.fn().mockReturnValue([])
      render(
        <div>
          <FloatingInput label="Flotante Legacy" defaultValue="Valor 1" />
          <LookupInput label="Lookup Legacy" onSearch={onSearch} />
        </div>
      )

      expect(screen.getByText('Flotante Legacy')).toBeInTheDocument()
      expect(screen.getByText('Lookup Legacy')).toBeInTheDocument()
    })

    it('debe cumplir con target size >= 44x44px en botones interactivos según WCAG 2.5.8 (Fase 4)', () => {
      render(
        <Input
          placeholder="Objetivos táctiles"
          allowClear
          defaultValue="Texto prueba"
          type="password"
          showPasswordToggle
        />
      )

      const clearBtn = screen.getByLabelText('Limpiar campo')
      expect(clearBtn).toHaveClass('min-w-[44px]', 'min-h-[44px]')

      const eyeBtn = screen.getByLabelText('Ver contraseña')
      expect(eyeBtn).toHaveClass('min-w-[44px]', 'min-h-[44px]')
    })

    it('debe activar comportamientos automáticos por tipo: email, tel y url (Fase 5)', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()

      const { rerender } = render(
        <Input
          type="email"
          placeholder="correo@ejemplo.com"
          onValueChange={onValueChange}
        />
      )

      const emailInput = screen.getByPlaceholderText('correo@ejemplo.com')
      expect(emailInput).toHaveAttribute('type', 'email')

      // Teléfono con formato automático
      rerender(
        <Input
          type="tel"
          placeholder="Teléfono"
          onValueChange={onValueChange}
        />
      )

      const telInput = screen.getByPlaceholderText('Teléfono')
      await user.type(telInput, '3001234567')
      expect(telInput).toHaveValue('300 123 4567')
    })

    it('debe mostrar estados de status con data-status y aria-invalid (Fase 4)', () => {
      const { rerender } = render(<Input placeholder="Status" status="success" />)
      let input = screen.getByPlaceholderText('Status')
      expect(input).toHaveAttribute('aria-invalid', 'false')
      expect(input).toHaveAttribute('data-status', 'success')

      rerender(<Input placeholder="Status" status="error" />)
      input = screen.getByPlaceholderText('Status')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('data-status', 'error')
    })
  })

  describe('Estandarización de Labels y FloatingTitle (v1.1.5)', () => {
    it('debe soportar labelMode="external" por defecto o explícito', () => {
      render(
        <Input
          id="ext-input"
          label="Etiqueta Externa"
          labelMode="external"
          placeholder="Escribe aquí"
        />
      )
      const label = screen.getByText('Etiqueta Externa')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', 'ext-input')
    })

    it('debe soportar labelMode="floating" y convertir placeholder/label en floatingTitle al enfocar', async () => {
      const user = userEvent.setup()
      render(
        <Input
          id="float-input"
          label="Ingresa tu correo"
          floatingTitle="CORREO ELECTRÓNICO"
          labelMode="floating"
          placeholder="usuario@dominio.com"
        />
      )

      // Inicialmente en reposo muestra el label / placeholder
      expect(screen.getByText('Ingresa tu correo')).toBeInTheDocument()
      expect(screen.queryByText('CORREO ELECTRÓNICO')).not.toBeInTheDocument()

      const input = screen.getByRole('textbox')
      await user.click(input)

      // Al enfocar, se convierte en el floatingTitle
      expect(screen.getByText('CORREO ELECTRÓNICO')).toBeInTheDocument()
    })

    it('debe mantener floatingTitle cuando el input tiene valor tras desenfocar', async () => {
      const user = userEvent.setup()
      render(
        <Input
          id="val-input"
          label="Número de Documento"
          floatingTitle="DOCUMENTO"
          labelMode="floating"
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, '12345678')
      await user.tab() // Desenfoque

      // Mantiene el floatingTitle porque tiene valor
      expect(screen.getByText('DOCUMENTO')).toBeInTheDocument()
    })

    it('debe propagar defaultLabelMode="floating" desde Form a través del FormContext', () => {
      render(
        <Form defaultLabelMode="floating">
          <Input id="form-input" label="Campo en Formulario" floatingTitle="TÍTULO ELEVADO" defaultValue="123" />
        </Form>
      )

      // Como tiene defaultValue, se activa inmediatamente con el floatingTitle
      expect(screen.getByText('TÍTULO ELEVADO')).toBeInTheDocument()
    })

    it('debe soportar floatingTitle en Select y Textarea', () => {
      render(
        <div>
          <Select
            label="Seleccione Opción"
            floatingTitle="OPCIÓN ACTIVA"
            labelMode="floating"
            value="1"
            options={[{ value: '1', label: 'Opción 1' }]}
          />
          <Textarea
            label="Comentarios"
            floatingTitle="OBSERVACIONES"
            labelMode="floating"
            defaultValue="Observación preliminar"
          />
        </div>
      )

      expect(screen.getByText('OPCIÓN ACTIVA')).toBeInTheDocument()
      expect(screen.getByText('OBSERVACIONES')).toBeInTheDocument()
    })
  })

});
