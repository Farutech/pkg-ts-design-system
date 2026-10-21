import React from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  PlusIcon,
  MinusIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import type { IconAdapter, IconProps } from './IconAdapter'
import { resolveIconSize } from './IconAdapter'
import { cn } from '@/utils/cn'

function wrapHeroicon(HeroComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>) {
  return function WrappedIcon({ size = 'md', className, style, ...props }: IconProps) {
    const sizeConfig = resolveIconSize(size)
    return (
      <HeroComponent
        className={cn(sizeConfig.className, className)}
        style={{ ...sizeConfig.style, ...style }}
        aria-hidden={props['aria-label'] ? undefined : true}
        {...props}
      />
    )
  }
}

function SpinnerIcon({ size = 'md', className, style, ...props }: IconProps) {
  const sizeConfig = resolveIconSize(size)
  return (
    <svg
      className={cn('animate-spin', sizeConfig.className, className)}
      style={{ ...sizeConfig.style, ...style }}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const defaultHeroiconsAdapter: IconAdapter = {
  ChevronDown: wrapHeroicon(ChevronDownIcon),
  ChevronUp: wrapHeroicon(ChevronUpIcon),
  ChevronLeft: wrapHeroicon(ChevronLeftIcon),
  ChevronRight: wrapHeroicon(ChevronRightIcon),
  ChevronUpDown: wrapHeroicon(ChevronUpDownIcon),
  Clear: wrapHeroicon(XMarkIcon),
  Close: wrapHeroicon(XMarkIcon),
  Eye: wrapHeroicon(EyeIcon),
  EyeOff: wrapHeroicon(EyeSlashIcon),
  Search: wrapHeroicon(MagnifyingGlassIcon),
  Spinner: SpinnerIcon,
  Check: wrapHeroicon(CheckIcon),
  Warning: wrapHeroicon(ExclamationTriangleIcon),
  Info: wrapHeroicon(InformationCircleIcon),
  Error: wrapHeroicon(ExclamationCircleIcon),
  Menu: wrapHeroicon(Bars3Icon),
  More: wrapHeroicon(EllipsisVerticalIcon),
  Plus: wrapHeroicon(PlusIcon),
  Minus: wrapHeroicon(MinusIcon),
  Copy: wrapHeroicon(DocumentDuplicateIcon),
  ExternalLink: wrapHeroicon(ArrowTopRightOnSquareIcon),
  Filter: wrapHeroicon(FunnelIcon),
  Sort: wrapHeroicon(ArrowsUpDownIcon),
  SortAsc: wrapHeroicon(BarsArrowUpIcon),
  SortDesc: wrapHeroicon(BarsArrowDownIcon),
  Calendar: wrapHeroicon(CalendarIcon),
  Clock: wrapHeroicon(ClockIcon),
  User: wrapHeroicon(UserIcon),
  Upload: wrapHeroicon(ArrowUpTrayIcon),
  Download: wrapHeroicon(ArrowDownTrayIcon),
  Trash: wrapHeroicon(TrashIcon),
  Edit: wrapHeroicon(PencilSquareIcon),
  Help: wrapHeroicon(QuestionMarkCircleIcon),
  Refresh: wrapHeroicon(ArrowPathIcon),
  Document: wrapHeroicon(DocumentTextIcon),
  Home: wrapHeroicon(HomeIcon),
  Success: wrapHeroicon(CheckIcon),
  Loading: SpinnerIcon,
}
