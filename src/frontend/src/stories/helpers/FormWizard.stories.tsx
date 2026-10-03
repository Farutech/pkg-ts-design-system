import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import { FormWizard } from '@/components/forms/FormWizard';
import type { WizardStep } from '@/components/forms/FormWizard';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';

const meta = {
  title: '7-Helpers/FormWizard',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FormWizard — Asistente multi-paso accesible con validación por etapas, stepper visual y slots tipados.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultWizard: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      companyName: '',
      taxId: '',
      contactEmail: '',
    });

    const steps: WizardStep[] = [
      {
        id: 'general',
        title: 'Datos Generales',
        description: 'Información básica de la empresa',
      },
      {
        id: 'contact',
        title: 'Contacto Principal',
        description: 'Responsable operativo y facturación',
      },
      {
        id: 'confirm',
        title: 'Confirmación',
        description: 'Verificación final de datos',
      },
    ];

    const renderContent = (currentStep: WizardStep) => {
      switch (currentStep.id) {
        case 'general':
          return (
            <div className="space-y-4 py-4">
              <FormField label="Razón Social" required>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder="Ej. Inversiones Andinas S.A.S."
                />
              </FormField>
              <FormField label="Número de Identificación Tributaria (NIT)" required>
                <Input
                  value={formData.taxId}
                  onChange={(e) => setFormData((p) => ({ ...p, taxId: e.target.value }))}
                  placeholder="Ej. 900.123.456-7"
                />
              </FormField>
            </div>
          );
        case 'contact':
          return (
            <div className="space-y-4 py-4">
              <FormField label="Correo Electrónico de Facturación" required>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="facturacion@empresa.com"
                />
              </FormField>
            </div>
          );
        case 'confirm':
          return (
            <div className="space-y-3 py-4 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Razón Social:</strong> {formData.companyName || 'Sin diligenciar'}</p>
              <p><strong>NIT:</strong> {formData.taxId || 'Sin diligenciar'}</p>
              <p><strong>Correo:</strong> {formData.contactEmail || 'Sin diligenciar'}</p>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <FormWizard
          steps={steps}
          renderContent={renderContent}
          onComplete={async () => {
            alert('¡Formulario completado exitosamente!');
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Datos Generales/i)).toBeInTheDocument();
    const nextBtn = canvas.getByRole('button', { name: /Siguiente/i });
    expect(nextBtn).toBeInTheDocument();
    await userEvent.click(nextBtn);
    expect(canvas.getByText(/Contacto Principal/i)).toBeInTheDocument();
  },
};
