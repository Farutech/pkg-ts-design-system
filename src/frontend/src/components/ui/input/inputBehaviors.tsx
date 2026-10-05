import React from 'react'
import type { InputBehavior, InputType } from './types'
import { Icon } from '@/primitives/Icon/Icon'

const MailIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LockIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const PhoneIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const GlobeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)}`
}

export const inputBehaviors: Record<InputType, InputBehavior> = {
  text: {
    placeholder: 'Escribe aquí...',
  },
  email: {
    icon: <MailIcon />,
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validationMessage: 'Ingresa un correo electrónico válido',
    autoComplete: 'email',
    inputMode: 'email',
    placeholder: 'correo@ejemplo.com',
    showClearButton: true,
  },
  password: {
    icon: <LockIcon />,
    autoComplete: 'current-password',
    showPasswordToggle: true,
    placeholder: 'Ingresa tu contraseña',
  },
  number: {
    validation: /^-?\d*\.?\d*$/,
    validationMessage: 'Solo se permiten números',
    inputMode: 'decimal',
    placeholder: '0',
    showStepper: true,
  },
  search: {
    icon: <Icon.Search size="sm" />,
    autoComplete: 'search',
    inputMode: 'search',
    placeholder: 'Buscar...',
    showClearButton: true,
  },
  tel: {
    icon: <PhoneIcon />,
    validation: /^[\d\s+\-()]*$/,
    validationMessage: 'Ingresa un número de teléfono válido',
    autoComplete: 'tel',
    inputMode: 'tel',
    placeholder: '300 123 4567',
    format: formatPhoneNumber,
  },
  url: {
    icon: <GlobeIcon />,
    validation: /^https?:\/\/.+/,
    validationMessage: 'Ingresa una URL válida (debe comenzar con http:// o https://)',
    autoComplete: 'url',
    inputMode: 'url',
    placeholder: 'https://ejemplo.com',
    showClearButton: true,
  },
  date: {
    icon: <Icon.Calendar size="sm" />,
    autoComplete: 'bday',
    placeholder: 'DD/MM/YYYY',
  },
}

export const getInputBehavior = (type: InputType | string = 'text'): InputBehavior => {
  return (inputBehaviors as Record<string, InputBehavior>)[type] || inputBehaviors.text
}

export const validateInputValue = (value: string, type: InputType | string): boolean => {
  const behavior = getInputBehavior(type)
  if (!behavior.validation || !value) return true
  return behavior.validation.test(value)
}

export const formatValueByType = (value: string, type: InputType | string): string => {
  const behavior = getInputBehavior(type)
  if (behavior.format) return behavior.format(value)
  return value
}
