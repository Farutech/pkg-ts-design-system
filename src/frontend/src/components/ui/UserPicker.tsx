import React from 'react'
import { EntityPicker } from './EntityPicker'
import { Avatar } from './Avatar'

export interface UserEntity {
  id: string | number
  name: string
  email: string
  avatarUrl?: string
  department?: string
  role?: string
}

export interface UserPickerProps {
  label?: string
  placeholder?: string
  value?: UserEntity | null
  onValueChange?: (user: UserEntity | null) => void
  onSearch: (query: string) => Promise<UserEntity[]> | UserEntity[]
  disabled?: boolean
  clearable?: boolean
  className?: string
}

export function UserPicker({
  label = 'Seleccionar colaborador',
  placeholder = 'Buscar usuario por nombre o correo...',
  value,
  onValueChange,
  onSearch,
  disabled,
  clearable,
  className,
}: UserPickerProps) {
  return (
    <EntityPicker<UserEntity>
      label={label}
      placeholder={placeholder}
      value={value}
      onValueChange={onValueChange}
      onSearch={onSearch}
      title="Directorio de colaboradores"
      disabled={disabled}
      clearable={clearable}
      className={className}
      renderTrigger={(user) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="sm"
          />
          <div className="truncate">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
            <span className="text-xs text-gray-400 ml-1.5">({user.email})</span>
          </div>
        </div>
      )}
      renderItem={(user, _isSelected) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="md"
          />
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            {(user.department || user.role) && (
              <span className="inline-block text-[11px] text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                {[user.role, user.department].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
