import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from '../FormField'
import { FieldArray } from '../FieldArray'
import { FormWizard } from '../FormWizard'

describe('Fase 4 — Suite de Formularios Estructurados', () => {
  describe('FormField', () => {
    it('debe renderizar label, required asterisk y mensaje de error con role="alert"', () => {
      render(
        <FormField
          label="Correo Electrónico"
          required
          error="Formato de correo no válido"
        >
          <input type="email" placeholder="correo@ejemplo.com" />
        </FormField>
      )

      expect(screen.getByText('Correo Electrónico')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
      const errorMsg = screen.getByRole('alert')
      expect(errorMsg).toHaveTextContent('Formato de correo no válido')
    })

    it('debe soportar render-prop children con ID accesible', () => {
      render(
        <FormField label="Nombre">
          {({ id, describedBy, invalid }) => (
            <input id={id} aria-describedby={describedBy} data-invalid={invalid} />
          )}
        </FormField>
      )

      expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    })
  })

  describe('FieldArray', () => {
    it('debe permitir agregar y eliminar filas dinámicamente', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      const onRemove = vi.fn()

      const items = [
        { id: '1', data: { phone: '12345' } },
        { id: '2', data: { phone: '67890' } },
      ]

      render(
        <FieldArray
          label="Teléfonos"
          items={items}
          onAdd={onAdd}
          onRemove={onRemove}
          renderItem={(item) => <span>{item.data.phone}</span>}
        />
      )

      expect(screen.getByText('12345')).toBeInTheDocument()
      expect(screen.getByText('67890')).toBeInTheDocument()

      const addBtn = screen.getByRole('button', { name: /agregar elemento/i })
      await user.click(addBtn)
      expect(onAdd).toHaveBeenCalledTimes(1)

      const removeBtns = screen.getAllByTitle('Eliminar elemento')
      await user.click(removeBtns[0])
      expect(onRemove).toHaveBeenCalledWith(0)
    })
  })

  describe('FormWizard', () => {
    it('debe navegar secuencialmente entre pasos', async () => {
      const user = userEvent.setup()
      const onComplete = vi.fn()

      const steps = [
        { id: 'step1', title: 'Datos Personales' },
        { id: 'step2', title: 'Confirmación' },
      ]

      render(
        <FormWizard
          steps={steps}
          onComplete={onComplete}
          renderContent={(step) => <div>Contenido de: {step.title}</div>}
        />
      )

      expect(screen.getByText('Contenido de: Datos Personales')).toBeInTheDocument()

      const nextBtn = screen.getByRole('button', { name: /siguiente/i })
      await user.click(nextBtn)

      expect(screen.getByText('Contenido de: Confirmación')).toBeInTheDocument()

      const finishBtn = screen.getByRole('button', { name: /finalizar/i })
      await user.click(finishBtn)

      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })
})
