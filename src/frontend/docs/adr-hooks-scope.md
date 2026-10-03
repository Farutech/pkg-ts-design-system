# ADR 004: Delimitación de Alcance para useFetch y useForm en el Design System

- **Estado:** Aceptado
- **Fecha:** 2026-10-02
- **Contexto:** Definición de hooks de la plataforma `@farutech/design-system v1.0.1-rc`

---

## 1. `useFetch` — Delegación a Capas de Datos Especializadas
### Contexto
Se evaluó incluir un hook genérico `useFetch` dentro del core del Design System.
### Decisión
**`useFetch` se declara formalmente fuera de alcance del Design System.**
### Justificación Técnica
1. **Separación de Responsabilidades:** Un Design System provee primitivas UI, tokens y controladores de interacción y accesibilidad (W3C ARIA APG). La gestión de peticiones HTTP, reintentos de red, invalidación de queries, revalidación en foco y mutations pertenecen a la capa de datos de la aplicación.
2. **Ecosistema Battle-Tested:** Forzar un `useFetch` casero introduciría una rueda cuadrada vulnerable y redundante frente a soluciones enterprise estándar ya adoptadas por los consumidores de FaruTech (`@tanstack/react-query` o `RTK Query`).
3. **Punto de Encuentro:** El Design System ofrece `useAsyncDataSource`, el cual gestiona la concurrencia de UI (debounce, `AbortController`, deduplicación de búsquedas y caché LRU) sin atarse a ningún protocolo ni cliente HTTP específico.

---

## 2. `useForm` y Formularios Compuestos — Estandarización sobre `react-hook-form`
### Contexto
Se evaluó mantener un motor de validación de formularios propio o integrar `react-hook-form`.
### Decisión
**Se adopta `react-hook-form` como peer dependency opcional para formularios complejos en `v1.1.0`.**
### Justificación Técnica
1. **Rendimiento de Render:** `react-hook-form` minimiza los re-renders mediante uncontrolled refs y suscripciones aisladas, alineándose con las directrices de alto rendimiento de FaruTech.
2. **Ecosistema de Validación:** Integración nativa con validadores de esquemas tipados como `zod` (`@hookform/resolvers/zod`).
3. **Componentes Básicos vs Compuestos:** Los inputs primitivos (`Input`, `Select`, `Combobox`) admiten control estándar `value`/`onValueChange`. Para Fase 4 (`1.1.0`), los componentes compuestos (`FormField`, `FieldArray`, `FormWizard`) se construirán sobre adaptadores que consumen `react-hook-form` sin obligar a los consumidores simples a incluirlo si no lo requieren.
