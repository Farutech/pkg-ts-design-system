import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import { SessionTimeoutDialog } from '@/security/SessionTimeoutDialog';
import { Button } from '@/components/ui/Button';

const meta = {
  title: '7-Overlays/SessionTimeoutDialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SessionTimeoutDialog — Diálogo modal accesible para alertar inactividad o expiración inminente de token con cuenta regresiva.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveWarning: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Simulación de advertencia de sesión por inactividad del usuario (1 segundo para demostración).
        </p>
        <Button onClick={() => setEnabled(true)}>
          {enabled ? 'Monitoreo de Sesión Activo' : 'Iniciar Monitoreo de Sesión'}
        </Button>
        <SessionTimeoutDialog
          enabled={enabled}
          idleTimeoutMs={1000}
          warningCountdownSeconds={30}
          onExtendSession={async () => {
            setEnabled(false);
            alert('Sesión extendida con éxito');
          }}
          onSessionExpired={() => {
            setEnabled(false);
            alert('Sesión cerrada por inactividad');
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Iniciar Monitoreo de Sesión/i });
    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
  },
};
