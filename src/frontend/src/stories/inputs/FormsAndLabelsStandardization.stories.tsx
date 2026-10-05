import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Form,
  FormRow,
  FormGroup,
  FormSection,
  FormActions,
  Input,
  Select,
  Textarea,
  Combobox,
  Button,
} from '@/index'

/**
 * # Estandarización de Labels y FloatingTitle (v1.1.5)
 * 
 * FaruTech Design System proporciona un modelo unificado de etiquetas para todos los controles del sistema (`Input`, `Select`, `Textarea`, `Combobox`):
 * 
 * 1. **Modo Externo (`labelMode="external"`)**: Etiqueta accesible ubicada en la parte superior exterior del control, ideal para formularios estándar y de alta densidad.
 * 2. **Modo Flotante (`labelMode="floating"` o `labelMode="placeholder"`)**: Etiqueta integrada que flota y se eleva con una animación suave CSS (`transition-all duration-200 ease-out transform origin-top-left`).
 * 3. **Transformación Placeholder a Título Elevado (`floatingTitle` / `activeLabel`)**: Permite que en reposo se muestre un placeholder o texto de guía extenso (ej. *"Ingresa tu correo empresarial"*), y al recibir foco o contener valor, desaparezca el placeholder y se eleve un título formal conciso (ej. *"CORREO ELECTRÓNICO"*).
 * 4. **Herencia de Contexto (`<Form defaultLabelMode="floating">`)**: Envuelve formularios completos propagando automáticamente el modo de etiqueta a todos los controles descendientes sin necesidad de configurarlo campo por campo.
 */
const meta: Meta = {
  title: 'Forms/Estandarización de Labels y Formularios',
  parameters: {
    docs: {
      description: {
        component:
          'Demostración integral de todas las alternativas de visualización de etiquetas, transiciones animadas de placeholder a título, compatibilidad multi-control y orquestación con el componente Form.',
      },
    },
  },
}

export default meta

/**
 * Comparación lado a lado: Etiqueta Externa vs Etiqueta Flotante
 */
export const ExternalVsFloating: StoryObj = {
  name: '1. Comparación: Label Externo vs Label Flotante',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Label Externo (labelMode="external")
          </h3>
          <p className="text-xs text-gray-500">Etiqueta estandarizada sobre el control</p>
        </div>
        <Input
          label="Nombre de la Empresa"
          placeholder="Ej: Afilamos S.A.S."
          labelMode="external"
        />
        <Select
          label="Régimen Tributario"
          placeholder="Seleccione régimen..."
          labelMode="external"
          options={[
            { value: 'comun', label: 'Régimen Común' },
            { value: 'simplificado', label: 'Régimen Simplificado' },
            { value: 'gran_contribuyente', label: 'Gran Contribuyente' },
          ]}
        />
        <Textarea
          label="Observaciones Generales"
          placeholder="Escriba aquí los detalles..."
          labelMode="external"
        />
      </div>

      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
          <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            Label Flotante (labelMode="floating")
          </h3>
          <p className="text-xs text-gray-500">Etiqueta integrada con animación de elevación al enfocar</p>
        </div>
        <Input
          label="Nombre de la Empresa"
          placeholder="Ej: Afilamos S.A.S."
          labelMode="floating"
        />
        <Select
          label="Régimen Tributario"
          placeholder="Seleccione régimen..."
          labelMode="floating"
          options={[
            { value: 'comun', label: 'Régimen Común' },
            { value: 'simplificado', label: 'Régimen Simplificado' },
            { value: 'gran_contribuyente', label: 'Gran Contribuyente' },
          ]}
        />
        <Textarea
          label="Observaciones Generales"
          placeholder="Escriba aquí los detalles..."
          labelMode="floating"
        />
      </div>
    </div>
  ),
}

/**
 * Placeholder que se convierte en Título Diferente (floatingTitle) con transición CSS suave
 */
export const PlaceholderToFloatingTitle: StoryObj = {
  name: '2. Placeholder convertido en Título Elevado (floatingTitle)',
  render: () => {
    return (
      <div className="max-w-2xl p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Transición Dinámica: En Reposo vs Enfocado / Con Valor
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            En estado de reposo, el usuario visualiza una guía clara o placeholder amigable. Apenas el campo recibe el foco o contiene texto, el texto guía se transforma en un título formal elevado con animación fluida.
          </p>
        </div>

        <div className="space-y-5">
          <Input
            label="Ingresa tu cédula o NIT sin dígito de verificación"
            floatingTitle="DOCUMENTO DE IDENTIDAD / NIT"
            labelMode="floating"
            placeholder="Ej: 900555123"
            required
          />

          <Input
            type="email"
            label="Correo empresarial para facturación electrónica"
            floatingTitle="CORREO ELECTRÓNICO DE FACTURACIÓN"
            labelMode="floating"
            placeholder="facturacion@empresa.com"
            required
          />

          <Select
            label="Selecciona la sede u oficina de atención"
            floatingTitle="SEDE PRINCIPAL"
            labelMode="floating"
            options={[
              { value: 'bog', label: 'Bogotá D.C. — Calle 80' },
              { value: 'med', label: 'Medellín — El Poblado' },
              { value: 'cal', label: 'Cali — Chipichape' },
            ]}
          />

          <Textarea
            label="Describe detalladamente el requerimiento de la solicitud"
            floatingTitle="DESCRIPCIÓN DEL REQUERIMIENTO"
            labelMode="floating"
            rows={3}
          />
        </div>
      </div>
    )
  },
}

/**
 * Cobertura Multi-Control con animación uniforme en todos los componentes interactivos
 */
export const MultiControlShowcase: StoryObj = {
  name: '3. Suite Multi-Control Estandarizada (Input, Select, Textarea, Combobox)',
  render: () => {
    return (
      <div className="max-w-3xl p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Todos los Controles con Comportamiento Homogéneo
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Cada control comparte la misma métrica visual, altura mínima (48px en modo flotante), escala tipográfica y animación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono de Contacto"
            floatingTitle="TELÉFONO PRINCIPAL"
            type="tel"
            labelMode="floating"
            placeholder="300 123 4567"
          />

          <Select
            label="Canal de Entrada"
            floatingTitle="CANAL DE ATENCIÓN"
            labelMode="floating"
            defaultValue="whatsapp"
            options={[
              { value: 'whatsapp', label: 'WhatsApp Oficial' },
              { value: 'email', label: 'Correo Electrónico' },
              { value: 'presencial', label: 'Sede Presencial' },
            ]}
          />

          <Combobox
            label="Escribe o busca un cliente"
            floatingTitle="CLIENTE SELECCIONADO"
            labelMode="floating"
            options={[
              { value: '1', label: 'Inversiones Farutech S.A.S.' },
              { value: '2', label: 'Afilamos Operaciones Industriales' },
              { value: '3', label: 'Aceros & Cuchillas del Norte' },
            ]}
          />

          <Input
            label="Valor Estimado ($)"
            floatingTitle="PRESUPUESTO"
            type="number"
            labelMode="floating"
            placeholder="0"
          />

          <div className="col-span-1 md:col-span-2">
            <Textarea
              label="Notas internas y seguimiento"
              floatingTitle="NOTAS DE SEGUIMIENTO"
              labelMode="floating"
              defaultValue="El cliente requiere entrega prioritaria en Bogotá."
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Formulario Completo Empresarial con <Form>, <FormSection>, <FormRow>, <FormGroup> y <FormActions>
 */
export const FullFormWithContext: StoryObj = {
  name: '4. Formulario Empresarial Completo con FormContext',
  render: () => {
    const [formData, setFormData] = useState({
      nit: '',
      razonSocial: '',
      canal: 'web',
      departamento: '',
      ciudad: '',
      email: '',
      telefono: '',
      observaciones: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitted(true)
    }

    return (
      <div className="max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded-full">
                Formulario Orquestado
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                Registro de Nueva Solicitud de Operaciones
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              defaultLabelMode="floating"
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Los controles dentro del contenedor <code>&lt;Form defaultLabelMode="floating"&gt;</code> flotan automáticamente sin necesidad de especificar <code>labelMode</code> en cada elemento.
          </p>
        </div>

        {submitted && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm">
            ✅ Formulario validado y recibido con éxito. Todos los campos flotaron y mantuvieron sus valores.
          </div>
        )}

        <Form
          defaultLabelMode="floating"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <FormSection
            title="Datos del Cliente"
            description="Información de identificación tributaria y razón social de la entidad solicitante"
          >
            <FormRow gap="md">
              <FormGroup cols={{ default: 12, md: 5 }}>
                <Input
                  label="Ingresa NIT o documento"
                  floatingTitle="NIT / DOCUMENTO"
                  required
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                />
              </FormGroup>

              <FormGroup cols={{ default: 12, md: 7 }}>
                <Input
                  label="Razón social o nombre completo"
                  floatingTitle="RAZÓN SOCIAL"
                  required
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                />
              </FormGroup>
            </FormRow>

            <FormRow gap="md">
              <FormGroup cols={{ default: 12, md: 6 }}>
                <Input
                  type="email"
                  label="Correo institucional de facturación"
                  floatingTitle="CORREO ELECTRÓNICO"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormGroup>

              <FormGroup cols={{ default: 12, md: 6 }}>
                <Input
                  type="tel"
                  label="Línea telefónica o WhatsApp"
                  floatingTitle="TELÉFONO DE CONTACTO"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection
            title="Ubicación y Canal"
            description="Configuración operativa de asignación y despacho"
          >
            <FormRow gap="md">
              <FormGroup cols={{ default: 12, md: 4 }}>
                <Select
                  label="Canal de Ingreso"
                  floatingTitle="CANAL"
                  value={formData.canal}
                  onValueChange={(val) => setFormData({ ...formData, canal: val })}
                  options={[
                    { value: 'web', label: 'Portal Web Farutech' },
                    { value: 'callcenter', label: 'Línea de Atención' },
                    { value: 'vendedor', label: 'Asesor Comercial' },
                  ]}
                />
              </FormGroup>

              <FormGroup cols={{ default: 12, md: 4 }}>
                <Select
                  label="Departamento"
                  floatingTitle="DEPARTAMENTO"
                  value={formData.departamento}
                  onValueChange={(val) => setFormData({ ...formData, departamento: val })}
                  options={[
                    { value: 'cundinamarca', label: 'Cundinamarca' },
                    { value: 'antioquia', label: 'Antioquia' },
                    { value: 'valle', label: 'Valle del Cauca' },
                    { value: 'santander', label: 'Santander' },
                  ]}
                />
              </FormGroup>

              <FormGroup cols={{ default: 12, md: 4 }}>
                <Input
                  label="Municipio o Ciudad"
                  floatingTitle="CIUDAD"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup cols={{ default: 12 }}>
                <Textarea
                  label="Instrucciones especiales para entrega o alistamiento"
                  floatingTitle="INSTRUCCIONES Y OBSERVACIONES"
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormActions align="between" className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  nit: '',
                  razonSocial: '',
                  canal: 'web',
                  departamento: '',
                  ciudad: '',
                  email: '',
                  telefono: '',
                  observaciones: '',
                })
                setSubmitted(false)
              }}
            >
              Limpiar Campos
            </Button>

            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost">
                Guardar Borrador
              </Button>
              <Button type="submit" variant="primary">
                Crear Solicitud Operativa
              </Button>
            </div>
          </FormActions>
        </Form>
      </div>
    )
  },
}
