import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LoadingPage } from '@/components/pages/LoadingPage';
import { ErrorPage } from '@/components/pages/ErrorPage';
import { NotFoundPage } from '@/components/pages/NotFoundPage';
import { OfflineBanner } from '@/components/pages/OfflineBanner';

const meta = {
  title: '6-Feedback/ApplicationPages',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Páginas y estados a nivel de aplicación (Loading, Error 500/403 con Incident ID, 404 Not Found y Banner Offline).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingState: Story = {
  render: () => (
    <div className="h-[450px] relative">
      <LoadingPage
        title="Iniciando plataforma empresarial"
        message="Verificando permisos y cargando catálogos de servicios..."
        fullScreen={false}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Iniciando plataforma empresarial/i)).toBeInTheDocument();
    expect(canvas.getByText(/Verificando permisos y cargando catálogos/i)).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  render: () => (
    <div className="h-[450px] relative">
      <ErrorPage
        errorCode="500"
        title="Error interno en el servidor"
        message="No fue posible sincronizar los registros contables en este momento."
        incidentId="INC-2026-9812-FT"
        fullScreen={false}
        onRetry={() => alert('Reintentando operación...')}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/500/i)).toBeInTheDocument();
    expect(canvas.getByText(/Error interno en el servidor/i)).toBeInTheDocument();
    expect(canvas.getByText(/INC-2026-9812-FT/i)).toBeInTheDocument();
  },
};

export const NotFoundState: Story = {
  render: () => (
    <div className="h-[450px] relative">
      <NotFoundPage homeUrl="#dashboard" fullScreen={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/404/i)).toBeInTheDocument();
    expect(canvas.getByText(/Página no encontrada/i)).toBeInTheDocument();
  },
};

export const OfflineBannerState: Story = {
  render: () => (
    <div className="h-64 relative p-6 bg-slate-50 dark:bg-slate-900">
      <OfflineBanner offlineMessage="Sin conexión a internet. Trabajando en modo local." />
      <div className="pt-16 text-center text-sm text-slate-500">
        OfflineBanner se activa automáticamente cuando se pierde la conexión de red (navigator.onLine).
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/OfflineBanner se activa automáticamente/i)).toBeInTheDocument();
  },
};
