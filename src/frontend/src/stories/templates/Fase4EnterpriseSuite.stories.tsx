import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker, DateRangePicker } from '@/components/ui/DateControls'
import { Dropzone, FileList, UploadProgress } from '@/components/ui/Upload'
import { FormField, FieldArray, FormWizard } from '@/components/forms'
import { UserPicker } from '@/components/ui/UserPicker'
import { ErrorPage, NotFoundPage, OfflineBanner } from '@/components/pages'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Enterprise/Fase 4 Suite Completa',
  parameters: {
    layout: 'padded',
  },
}

export default meta

export const DateControlsWithDensity: StoryObj = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())
    const [range, setRange] = useState<[Date | null, Date | null]>([new Date(), null])

    return (
      <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-bold">Date Controls con Densidad Operativa</h3>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">DatePicker (Comfortable vs Compact vs Dense)</p>
          <DatePicker
            label="Fecha Comfortable (44px)"
            density="comfortable"
            value={date}
            onValueChange={setDate}
          />
          <DatePicker
            label="Fecha Compact (36px)"
            density="compact"
            value={date}
            onValueChange={setDate}
          />
          <DatePicker
            label="Fecha Dense (28px)"
            density="dense"
            value={date}
            onValueChange={setDate}
          />
        </div>

        <div className="pt-4 border-t">
          <DateRangePicker
            label="Rango de Fechas"
            value={range}
            onValueChange={setRange}
            presets={['today', 'last7days', 'thisMonth']}
          />
        </div>
      </div>
    )
  },
}

export const UploadSuiteDemo: StoryObj = {
  render: () => {
    const [files, setFiles] = useState([
      { id: '1', name: 'reporte-anual-2026.pdf', size: 2450000, status: 'completed' as const },
    ])
    const [uploadingProgress, setUploadingProgress] = useState(65)

    return (
      <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-bold">Suite de Carga de Archivos (Upload)</h3>

        <Dropzone
          accept="image/*,.pdf,.docx"
          onFilesAccepted={(newFiles) => {
            const items = newFiles.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name,
              size: f.size,
              status: 'completed' as const,
            }))
            setFiles((prev) => [...prev, ...items])
          }}
        />

        <UploadProgress
          fileName="balance-consolidado.xlsx"
          progress={uploadingProgress}
          status="uploading"
          onCancel={() => setUploadingProgress(0)}
        />

        <FileList
          files={files}
          onRemove={(id) => setFiles(files.filter((f) => f.id !== id))}
        />
      </div>
    )
  },
}

export const FormsAndFieldArrayDemo: StoryObj = {
  render: () => {
    const [phones, setPhones] = useState([
      { id: '1', data: { number: '+57 300 123 4567', type: 'Móvil' } },
      { id: '2', data: { number: '+57 602 888 9900', type: 'Oficina' } },
    ])

    return (
      <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-bold">Formularios Estructurados</h3>

        <FormField label="Razón Social" required tooltip="Nombre legal registrado en Cámara de Comercio">
          <Input placeholder="Ej. FaruTech Soluciones S.A.S." />
        </FormField>

        <FieldArray
          label="Números de Contacto"
          description="Agregue las líneas de atención corporativas"
          items={phones}
          onAdd={() => setPhones([...phones, { id: String(Date.now()), data: { number: '', type: 'Nuevo' } }])}
          onRemove={(idx) => setPhones(phones.filter((_, i) => i !== idx))}
          renderItem={(item) => (
            <div className="flex gap-2">
              <Input defaultValue={item.data.number} placeholder="Número telefónico" />
              <Input defaultValue={item.data.type} placeholder="Tipo" className="w-28" />
            </div>
          )}
        />
      </div>
    )
  },
}

export const FormWizardDemo: StoryObj = {
  render: () => {
    return (
      <Card className="max-w-2xl p-6">
        <FormWizard
          steps={[
            { id: 's1', title: 'Cuenta' },
            { id: 's2', title: 'Seguridad' },
            { id: 's3', title: 'Confirmar' },
          ]}
          renderContent={(step, idx) => (
            <div className="py-4 space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Paso {idx + 1}: {step.title}
              </h4>
              <Input label="Campo de prueba del paso" placeholder={`Completando ${step.title}...`} />
            </div>
          )}
          onComplete={() => alert('¡Formulario completado!')}
        />
      </Card>
    )
  },
}

export const EntityAndUserPickerDemo: StoryObj = {
  render: () => {
    const mockUsers = [
      { id: 1, name: 'Farid Maloof', email: 'farid@farutech.com', role: 'Lead Architect', department: 'Engineering' },
      { id: 2, name: 'Valeria Gómez', email: 'valeria@farutech.com', role: 'Product Manager', department: 'Design' },
      { id: 3, name: 'Carlos Mendoza', email: 'carlos@farutech.com', role: 'DevOps Lead', department: 'Infrastructure' },
    ]

    const [selectedUser, setSelectedUser] = useState<any>(mockUsers[0])

    return (
      <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-bold">Selección Avanzada de Entidades</h3>

        <UserPicker
          label="Asignar Responsable"
          value={selectedUser}
          onValueChange={setSelectedUser}
          onSearch={(q) => mockUsers.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()))}
        />
      </div>
    )
  },
}

export const ApplicationPagesDemo: StoryObj = {
  render: () => {
    return (
      <div className="space-y-6 max-w-2xl">
        <OfflineBanner />
        <Card className="p-4 space-y-4">
          <h3 className="font-bold">Páginas de Estado (Modo Incrustado)</h3>
          <div className="border rounded-lg overflow-hidden">
            <NotFoundPage fullScreen={false} />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <ErrorPage fullScreen={false} />
          </div>
        </Card>
      </div>
    )
  },
}
