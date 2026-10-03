import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'

export interface WizardStep {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  validate?: () => Promise<boolean> | boolean
}

export interface FormWizardProps {
  steps: WizardStep[]
  activeStep?: number
  onStepChange?: (stepIndex: number) => void
  onComplete?: () => Promise<void> | void
  renderContent: (currentStep: WizardStep, stepIndex: number) => React.ReactNode
  prevLabel?: string
  nextLabel?: string
  finishLabel?: string
  isSubmitting?: boolean
  className?: string
}

/**
 * FormWizard - Orquestador de formularios por etapas (stepper / onboarding / flujos complejos).
 */
export function FormWizard({
  steps,
  activeStep: propActiveStep,
  onStepChange,
  onComplete,
  renderContent,
  prevLabel = 'Anterior',
  nextLabel = 'Siguiente',
  finishLabel = 'Finalizar',
  isSubmitting = false,
  className,
}: FormWizardProps) {
  const [internalStep, setInternalStep] = useState(0)
  const [validating, setValidating] = useState(false)

  const currentStepIndex = propActiveStep !== undefined ? propActiveStep : internalStep
  const currentStep = steps[currentStepIndex] || steps[0]

  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const goToStep = async (targetIndex: number) => {
    if (targetIndex < currentStepIndex) {
      setInternalStep(targetIndex)
      onStepChange?.(targetIndex)
      return
    }

    if (currentStep.validate) {
      setValidating(true)
      try {
        const isValid = await currentStep.validate()
        if (!isValid) return
      } finally {
        setValidating(false)
      }
    }

    setInternalStep(targetIndex)
    onStepChange?.(targetIndex)
  }

  const handleNext = async () => {
    if (isLastStep) {
      if (currentStep.validate) {
        setValidating(true)
        try {
          const isValid = await currentStep.validate()
          if (!isValid) return
        } finally {
          setValidating(false)
        }
      }
      onComplete?.()
    } else {
      goToStep(currentStepIndex + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      goToStep(currentStepIndex - 1)
    }
  }

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Barra de progreso de pasos */}
      <nav aria-label="Progreso del formulario" className="w-full">
        <ol className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 overflow-x-auto">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex

            return (
              <li
                key={step.id}
                className={cn(
                  'flex items-center gap-2.5 flex-1 min-w-[120px]',
                  isCurrent ? 'text-primary-600 dark:text-primary-400 font-semibold' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                    isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-950'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  )}
                >
                  {isCompleted ? <Icon.Success size="xs" /> : idx + 1}
                </div>

                <div className="overflow-hidden">
                  <p className="text-xs uppercase tracking-wider truncate">{step.title}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Contenido del paso activo */}
      <div className="min-h-[220px]">
        {renderContent(currentStep, currentStepIndex)}
      </div>

      {/* Barra de navegación de pasos */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          onClick={handlePrev}
          disabled={isFirstStep || isSubmitting || validating}
        >
          {prevLabel}
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          isLoading={validating || isSubmitting}
        >
          {isLastStep ? finishLabel : nextLabel}
        </Button>
      </div>
    </div>
  )
}
