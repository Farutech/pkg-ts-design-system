import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EntityPicker } from '../EntityPicker'
import { UserPicker } from '../UserPicker'

describe('Fase 4 — Suite de Selección Avanzada (EntityPicker & UserPicker)', () => {
  it('EntityPicker debe abrir modal de búsqueda y permitir seleccionar una entidad', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    const customers = [
      { id: 1, name: 'Empresa Alfa' },
      { id: 2, name: 'Corporación Beta' },
    ]

    render(
      <EntityPicker
        label="Cliente"
        placeholder="Seleccione cliente..."
        onSearch={async (q) => customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))}
        onValueChange={onValueChange}
        renderItem={(item) => <span>{item.name}</span>}
      />
    )

    const trigger = screen.getByRole('button', { name: /seleccione cliente\.\.\./i })
    await user.click(trigger)

    expect(screen.getByText('Seleccionar elemento')).toBeInTheDocument()
    expect(await screen.findByText('Empresa Alfa')).toBeInTheDocument()

    await user.click(screen.getByText('Empresa Alfa'))
    expect(onValueChange).toHaveBeenCalledWith(customers[0])
  })

  it('UserPicker debe renderizar usuario seleccionado con avatar', () => {
    const activeUser = {
      id: 'usr-1',
      name: 'Farid Maloof',
      email: 'farid@farutech.com',
      role: 'Lead Architect',
      department: 'Engineering',
    }

    render(
      <UserPicker
        value={activeUser}
        onSearch={() => [activeUser]}
      />
    )

    expect(screen.getByText('Farid Maloof')).toBeInTheDocument()
    expect(screen.getByText('(farid@farutech.com)')).toBeInTheDocument()
  })
})
