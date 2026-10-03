/**
 * UI Components
 *
 * Barrel exports for the component library.
 *
 * Organization:
 * 1. Form & Input
 * 2. Buttons & Actions
 * 3. Feedback & Status
 * 4. Layout & Surfaces
 * 5. Navigation
 * 6. Data Display
 * 7. Date & Time
 * 8. Loading & Skeletons
 * 9. Overlays & Floating UI
 * 10. Advanced / Application Components
 * 11. Charts
 * 12. Specialized Components
 * 13. Shared Types
 */

// ============================================================================
// 1. FORM & INPUT
// ============================================================================

export { InputBase, type InputBaseProps, type InputSize, type InputVariant, type InputStatus } from './InputBase'
export { Input, type InputProps, type ValidationMode } from './Input'
export { InputGroup, type InputGroupProps } from './InputGroup'
export { PasswordInput, type PasswordInputProps } from './PasswordInput'
export { SearchInput, type SearchInputProps } from './SearchInput'
export { NumberInput, type NumberInputProps } from './NumberInput'
export { MaskedInput } from './MaskedInput'
export type { MaskedInputProps, PredefinedMask } from './MaskedInput'
export { Textarea, type TextareaProps } from './Textarea'
export {
  type DataMappingProps,
  resolveOptionValue,
  resolveOptionLabel,
} from './DataMapping'
export { ListboxCore, type ListboxCoreProps } from './ListboxCore'
export { Select, type SelectProps, type SelectOption } from './Select'
export { Combobox, type ComboboxProps, type ComboboxOption } from './Combobox'
export { RemoteSelect, type RemoteSelectProps } from './RemoteSelect'
export { MultiSelect, type MultiSelectProps, type MultiSelectOption } from './MultiSelect'
export { Checkbox, CheckboxGroup } from './Checkbox'
export { RadioGroup } from './RadioGroup'
export type { RadioOption } from './RadioGroup'
export { Switch } from './Switch'
export { PhoneInput } from './PhoneInput'
export { OTPInput } from './OTPInput'
export type { OTPInputProps } from './OTPInput'
export { TagInput } from './TagInput'
export type { Tag, TagInputProps } from './TagInput'
export { Slider } from './Slider'
export type { SliderProps } from './Slider'
export { Rating } from './Rating'
export type { RatingProps } from './Rating'
export { Form, FormRow, FormGroup, FormSection, FormActions } from './Form'

// ============================================================================
// 2. BUTTONS & ACTIONS
// ============================================================================

export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './Button'

export { ButtonGroup } from './ButtonGroup'
export { BulkActionsBar, type BulkActionsBarProps, type BulkActionItem } from './BulkActionsBar'

export {
  IconButton,
} from './IconButton'

export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
} from './IconButton'

export { FloatingActionButton } from './FloatingActionButton'
export type {
  FloatingActionButtonProps,
  FABAction,
} from './FloatingActionButton'

export { Link } from './Link'
export type { LinkProps, LinkVariant } from './Link'

// ============================================================================
// 3. FEEDBACK & STATUS
// ============================================================================

export {
  Alert,
  type AlertProps,
  type AlertVariant,
} from './Alert'

export {
  Badge,
  StatusBadge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
} from './Badge'

export { Chip } from './Chip'
export type { ChipProps, ChipVariant } from './Chip'

export {
  ToastContainer,
} from './Toast'

export {
  EmptyState,
  NoDataState,
  NoResultsState,
  NoPermissionState,
  ErrorState,
} from './EmptyState'

export type { EmptyStateProps } from './EmptyState'

// ============================================================================
// 4. LAYOUT & SURFACES
// ============================================================================

export { Card, CardHeader } from './Card'

export { Divider, SectionHeader } from './Divider'

export { Accordion, AccordionItem } from './Accordion'
export type {
  AccordionProps,
  AccordionItemProps,
} from './Accordion'

export { Drawer, DrawerFooter } from './Drawer'
export type { DrawerProps } from './Drawer'

// ============================================================================
// 5. NAVIGATION
// ============================================================================

export { Breadcrumb } from './Breadcrumb'
export type { BreadcrumbItem } from './Breadcrumb'

export { Tabs } from './Tabs'
export type { TabItem } from './Tabs'

export { Dropdown } from './Dropdown'
export type { DropdownItem } from './Dropdown'

export { ListBox } from './ListBox'
export type { ListBoxOption } from './ListBox'

export { ListGroup } from './ListGroup'
export type { ListGroupItem } from './ListGroup'

export { Pagination } from './Pagination'
export type { PaginationProps } from './Pagination'

export { SegmentedControl } from './SegmentedControl'
export type {
  SegmentedControlProps,
  SegmentedOption,
} from './SegmentedControl'

// ============================================================================
// 6. DATA DISPLAY
// ============================================================================

export { default as Table } from './Table'
export type {
  TableProps,
  TableColumn,
  TableRowData,
} from './Table'

export { DataTable } from './DataTable'
export type {
  DataTableProps,
  DataTablePagination,
  DataTableActions,
  DataTableGlobalAction,
  DataTableFilter,
  FilterState,
  FilterType,
} from './DataTable'

export { StatsCard, StatsCardGroup } from './StatsCard'
export type { StatsCardProps } from './StatsCard'

export { ProgressBar, MultiProgressBar } from './ProgressBar'

export {
  Timeline,
} from './Timeline'

export type {
  TimelineProps,
  TimelineItem,
} from './Timeline'

// ============================================================================
// 7. DATE & TIME
// ============================================================================

export {
  DatePicker,
  DateTimePicker,
  DateRangePicker,
} from './DatePicker'
export { DatePickerInterval } from './DatePickerInterval'

export type {
  DatePickerProps,
  DateTimePickerProps,
  DateRangePickerProps,
} from './DatePicker'
export type { DatePickerIntervalProps } from './DatePickerInterval'

// Advanced Date Controls
export {
  DatePicker as DatePickerV2,
  DateRangePicker as DateRangePickerV2,
  TimeRangePicker,
  CalendarNavigation,
  CalendarGrid,
  TimePicker,
} from './DateControls'

export type {
  SingleDatePickerProps,
  DateRangePickerProps as DateRangePickerV2Props,
  TimeRangePickerProps,
  BaseDatePickerProps,
} from './DateControls'

// ============================================================================
// 8. LOADING & SKELETONS
// ============================================================================

export {
  Loading,
  Skeleton as LoadingSkeleton,
  TableSkeleton,
  CardSkeleton,
} from './Loading'

export {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonForm,
  SkeletonText,
  SkeletonAvatar,
  SkeletonGrid,
} from './Skeleton'

export {
  Spinner,
  ProgressSpinner,
} from './Spinner'

export type { SpinnerProps } from './Spinner'

export {
  LogoSpinner,
  LogoSpinnerOverlay,
} from './LogoSpinner'

export {
  GlobalLoading,
  useGlobalLoading,
} from './GlobalLoading'

// ============================================================================
// 9. OVERLAYS & FLOATING UI
// ============================================================================

export { Modal } from './Modal'
export { Popover } from './Popover'
export type { PopoverProps } from './Popover'

export { Tooltip } from './Tooltip'

export { Carousel } from './Carousel'

// ============================================================================
// 10. ADVANCED / APPLICATION COMPONENTS
// ============================================================================

export { Scheduler } from './Scheduler'
export type {
  SchedulerProps,
  SchedulerConfig,
  Appointment,
  AppointmentStatus,
  ViewMode,
} from './Scheduler'

export { ModuleSwitcher, useModuleSwitcher } from './ModuleSwitcher'
export type {
  Module,
  ModuleSwitcherProps,
} from './ModuleSwitcher'

export { CommandPalette, useCommandPalette } from './CommandPalette'
export type {
  Command,
  CommandPaletteProps,
} from './CommandPalette'

export { NotificationPanel } from './NotificationPanel'
export type {
  Notification as NotificationItem,
  NotificationPanelProps,
} from './NotificationPanel'

export { CodePreview, CodePreviewGroup } from './CodePreview'
export type {
  CodePreviewProps,
  CodePreviewGroupProps,
} from './CodePreview'

// ============================================================================
// 11. CHARTS
// ============================================================================

export {
  ChartLine,
  ChartBar,
  ChartPie,
  ChartArea,
  ChartRadar,
  ChartGauge,
  CHART_COLORS,
  DEFAULT_COLORS,
} from './Charts'

export type {
  ChartLineProps,
  ChartBarProps,
  ChartPieProps,
  ChartAreaProps,
  ChartRadarProps,
  ChartGaugeProps,
} from './Charts'

// ============================================================================
// 12. SPECIALIZED COMPONENTS
// ============================================================================

export { Avatar, AvatarGroup } from './Avatar'

export { ThemeToggle } from './ThemeToggle'
export type { ThemeToggleProps } from './ThemeToggle'

// ============================================================================
// 13. SELECTION & UPLOAD SUITE
// ============================================================================

export { EntityPicker, type EntityPickerProps } from './EntityPicker'
export { UserPicker, type UserPickerProps, type UserEntity } from './UserPicker'
export { Dropzone, type DropzoneProps } from './Upload/Dropzone'
export { FileList, type FileListProps, type UploadFileItem } from './Upload/FileList'
export { UploadProgress, type UploadProgressProps } from './Upload/UploadProgress'
