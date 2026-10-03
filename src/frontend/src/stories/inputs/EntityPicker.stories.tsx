import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import { EntityPicker } from '@/components/ui/EntityPicker';
import { UserPicker } from '@/components/ui/UserPicker';
import type { UserEntity } from '@/components/ui/UserPicker';

interface ClientAccount {
  id: string;
  name: string;
  taxId: string;
  tier: string;
}

const mockClients: ClientAccount[] = [
  { id: 'cli-001', name: 'Inversiones Globales S.A.', taxId: 'NIT 900.123.456-1', tier: 'Enterprise' },
  { id: 'cli-002', name: 'Soluciones Tecnológicas Faru', taxId: 'NIT 900.654.321-2', tier: 'Partner' },
  { id: 'cli-003', name: 'Constructora Bolívar & Co.', taxId: 'NIT 800.987.654-3', tier: 'Standard' },
];

const mockUsers: UserEntity[] = [
  { id: 'usr-1', name: 'Sofía Valenzuela', email: 'sofia.v@farutech.com', role: 'Tech Lead', department: 'Arquitectura' },
  { id: 'usr-2', name: 'Carlos Mendoza', email: 'carlos.m@farutech.com', role: 'Senior Backend Engineer', department: 'Plataforma' },
  { id: 'usr-3', name: 'Laura Restrepo', email: 'laura.r@farutech.com', role: 'Product Manager', department: 'Innovación' },
];

const meta = {
  title: '4-Inputs/EntityPicker',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Selectores de entidad empresariales (Lookup genérico EntityPicker<T> y UserPicker especializado con avatares y roles).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntityPickerDemo: Story = {
  render: () => {
    const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);

    const searchClients = async (query: string) => {
      const lower = query.toLowerCase();
      return mockClients.filter((c) => c.name.toLowerCase().includes(lower) || c.taxId.toLowerCase().includes(lower));
    };

    return (
      <div className="max-w-md mx-auto space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Cliente corporativo asignado
        </label>
        <EntityPicker<ClientAccount>
          value={selectedClient}
          onValueChange={setSelectedClient}
          onSearch={searchClients}
          title="Seleccionar Cuenta de Cliente"
          placeholder="Haz clic para asociar cliente..."
          renderItem={(client: ClientAccount, isSelected: boolean) => (
            <div className={`flex items-center justify-between p-2 rounded ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950/40' : ''}`}>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{client.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{client.taxId}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {client.tier}
              </span>
            </div>
          )}
          renderTrigger={(client: ClientAccount) => <span>{client.name} ({client.taxId})</span>}
        />
        {selectedClient && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Seleccionado: {selectedClient.name}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /haz clic para asociar cliente/i });
    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
  },
};

export const UserPickerDemo: Story = {
  render: () => {
    const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);

    const searchUsers = async (query: string) => {
      const lower = query.toLowerCase();
      return mockUsers.filter((u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower));
    };

    return (
      <div className="max-w-md mx-auto space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Líder de Proyecto
        </label>
        <UserPicker
          value={selectedUser}
          onValueChange={setSelectedUser}
          onSearch={searchUsers}
          placeholder="Asignar colaborador..."
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /asignar colaborador/i });
    expect(trigger).toBeInTheDocument();
  },
};
