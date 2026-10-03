import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import { FieldArray } from '@/components/forms/FieldArray';
import type { FieldArrayItem } from '@/components/forms/FieldArray';
import { Input } from '@/components/ui/Input';

interface PhoneItem {
  type: string;
  number: string;
}

const meta = {
  title: '7-Helpers/FieldArray',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FieldArray — Motor accesible para campos dinámicos con inserción, eliminación y reordenamiento con aria-live.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DynamicPhones: Story = {
  render: () => {
    const [phones, setPhones] = useState<FieldArrayItem<PhoneItem>[]>([
      { id: 'p1', data: { type: 'Móvil', number: '+57 300 123 4567' } },
      { id: 'p2', data: { type: 'Oficina', number: '+57 601 789 0123' } },
    ]);

    return (
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Números de Contacto Corporativo
        </h3>
        <FieldArray<PhoneItem>
          items={phones}
          onAdd={() => {
            const newItem: FieldArrayItem<PhoneItem> = {
              id: `phone-${Date.now()}`,
              data: { type: 'Móvil', number: '' },
            };
            setPhones((prev) => [...prev, newItem]);
          }}
          onRemove={(index) => {
            setPhones((prev) => prev.filter((_, i) => i !== index));
          }}
          addLabel="Agregar Número"
          renderItem={(item, index) => (
            <div className="flex items-center gap-3 w-full">
              <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
              <div className="flex-1">
                <Input
                  value={item.data.number}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhones((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, data: { ...p.data, number: val } } : p)),
                    );
                  }}
                  placeholder="+57 300 000 0000"
                />
              </div>
            </div>
          )}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Números de Contacto Corporativo/i)).toBeInTheDocument();
    expect(canvas.getByDisplayValue('+57 300 123 4567')).toBeInTheDocument();
    const addBtn = canvas.getByRole('button', { name: /Agregar Número/i });
    expect(addBtn).toBeInTheDocument();
    await userEvent.click(addBtn);
    expect(canvas.getAllByRole('textbox')).toHaveLength(3);
  },
};
