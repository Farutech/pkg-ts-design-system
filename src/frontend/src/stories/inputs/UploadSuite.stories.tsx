import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Dropzone, FileList, UploadProgress } from '@/components/ui/Upload';
import type { UploadFileItem } from '@/components/ui/Upload';

const meta = {
  title: '4-Inputs/UploadSuite',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Suite de carga de archivos enterprise con Dropzone accesible, lista de items con formateo de bytes y barra de progreso animada.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveUpload: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadFileItem[]>([
      { id: '1', name: 'reporte_financiero_2026.pdf', size: 1024 * 1024 * 2.4, status: 'completed' },
      { id: '2', name: 'contrato_firmado.docx', size: 1024 * 512, status: 'uploading', progress: 68 },
    ]);

    const handleFilesAccepted = (newFiles: File[]) => {
      const added: UploadFileItem[] = newFiles.map((f, i) => ({
        id: `dropped-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        status: 'completed',
      }));
      setFiles((prev) => [...prev, ...added]);
    };

    const handleRemove = (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Carga de Documentos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Arrastra y suelta tus archivos o haz clic para seleccionarlos desde tu equipo.
          </p>
          <Dropzone
            onFilesAccepted={handleFilesAccepted}
            maxSizeBytes={10 * 1024 * 1024}
            accept=".pdf,.png,.jpg,.docx"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Progreso general</h4>
          <UploadProgress progress={68} status="uploading" message="Subiendo contrato_firmado.docx (68%)" />
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Archivos ({files.length})</h4>
          <FileList files={files} onRemove={handleRemove} />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/reporte_financiero_2026\.pdf/i)).toBeInTheDocument();
    expect(canvas.getAllByText(/contrato_firmado\.docx/i).length).toBeGreaterThan(0);
    expect(canvas.getByText(/2\.4 MB/i)).toBeInTheDocument();
    expect(canvas.getAllByText(/68%/i).length).toBeGreaterThan(0);
  },
};
