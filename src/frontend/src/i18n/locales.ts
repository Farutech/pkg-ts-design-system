export interface DesignSystemMessages {
  dataTable: {
    searchPlaceholder: string
    emptyMessage: string
    columnsLabel: string
    filtersLabel: string
    clearFiltersLabel: string
    selectAllLabel: string
    selectedCount: string
  }
  select: {
    placeholder: string
    clearLabel: string
    searchPlaceholder: string
    noResults: string
  }
  pagination: {
    showingRange: string // '{start} a {end} de {total}'
    previous: string
    next: string
    pageOf: string
  }
  fileUpload: {
    dragDropText: string
    dragActiveText: string
    browseButton: string
    maxSizeError: string
    invalidTypeError: string
    uploadingText: string
    successText: string
    removeFileLabel: string
  }
  security: {
    sessionExpiringTitle: string
    sessionExpiringDesc: string
    extendSession: string
    logout: string
  }
  general: {
    loading: string
    save: string
    cancel: string
    delete: string
    confirm: string
    close: string
  }
}

export const esMessages: DesignSystemMessages = {
  dataTable: {
    searchPlaceholder: 'Buscar...',
    emptyMessage: 'No hay registros disponibles',
    columnsLabel: 'Columnas',
    filtersLabel: 'Filtros',
    clearFiltersLabel: 'Limpiar filtros',
    selectAllLabel: 'Seleccionar todas las filas',
    selectedCount: '{count} seleccionados',
  },
  select: {
    placeholder: 'Selecciona una opción...',
    clearLabel: 'Limpiar selección',
    searchPlaceholder: 'Buscar opción...',
    noResults: 'No se encontraron resultados',
  },
  pagination: {
    showingRange: 'Mostrando {start} a {end} de {total} registros',
    previous: 'Anterior',
    next: 'Siguiente',
    pageOf: 'Página {current} de {total}',
  },
  fileUpload: {
    dragDropText: 'Arrastra y suelta tus archivos aquí, o',
    dragActiveText: 'Suelta los archivos aquí para cargarlos',
    browseButton: 'Explorar archivos',
    maxSizeError: 'El archivo excede el tamaño máximo permitido ({maxSize})',
    invalidTypeError: 'Tipo de archivo no permitido. Formatos aceptados: {formats}',
    uploadingText: 'Cargando archivo...',
    successText: 'Archivo cargado con éxito',
    removeFileLabel: 'Eliminar archivo',
  },
  security: {
    sessionExpiringTitle: 'Su sesión está a punto de expirar',
    sessionExpiringDesc: 'Por motivos de seguridad, su sesión se cerrará automáticamente en:',
    extendSession: 'Extender Sesión',
    logout: 'Cerrar Sesión',
  },
  general: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    close: 'Cerrar',
  },
}

export const enMessages: DesignSystemMessages = {
  dataTable: {
    searchPlaceholder: 'Search...',
    emptyMessage: 'No records available',
    columnsLabel: 'Columns',
    filtersLabel: 'Filters',
    clearFiltersLabel: 'Clear filters',
    selectAllLabel: 'Select all rows',
    selectedCount: '{count} selected',
  },
  select: {
    placeholder: 'Select an option...',
    clearLabel: 'Clear selection',
    searchPlaceholder: 'Search options...',
    noResults: 'No results found',
  },
  pagination: {
    showingRange: 'Showing {start} to {end} of {total} records',
    previous: 'Previous',
    next: 'Next',
    pageOf: 'Page {current} of {total}',
  },
  fileUpload: {
    dragDropText: 'Drag and drop your files here, or',
    dragActiveText: 'Drop files here to upload',
    browseButton: 'Browse files',
    maxSizeError: 'File exceeds maximum allowed size ({maxSize})',
    invalidTypeError: 'Invalid file type. Accepted formats: {formats}',
    uploadingText: 'Uploading file...',
    successText: 'File uploaded successfully',
    removeFileLabel: 'Remove file',
  },
  security: {
    sessionExpiringTitle: 'Your session is about to expire',
    sessionExpiringDesc: 'For security reasons, your session will automatically close in:',
    extendSession: 'Extend Session',
    logout: 'Log Out',
  },
  general: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
  },
}
