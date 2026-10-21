export interface CountryData {
  code: string          // ISO 3166-1 alpha-2 (ej. 'CO')
  iso3: string          // ISO 3166-1 alpha-3 (ej. 'COL')
  name: string          // Nombre en español (ej. 'Colombia')
  dialCode: string      // Prefijo telefónico (ej. '+57')
  flag: string          // Emoji de bandera (ej. '🇨🇴')
  currency: string      // Código ISO 4217 (ej. 'COP')
  currencySymbol: string // Símbolo monetario (ej. '$')
}

export const COUNTRIES: CountryData[] = [
  // Países prioritarios de FaruTech
  { code: 'CO', iso3: 'COL', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', currency: 'COP', currencySymbol: '$' },
  { code: 'MX', iso3: 'MEX', name: 'México', dialCode: '+52', flag: '🇲🇽', currency: 'MXN', currencySymbol: '$' },
  { code: 'US', iso3: 'USA', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸', currency: 'USD', currencySymbol: '$' },
  { code: 'ES', iso3: 'ESP', name: 'España', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€' },
  { code: 'AR', iso3: 'ARG', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', currency: 'ARS', currencySymbol: '$' },
  { code: 'CL', iso3: 'CHL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', currency: 'CLP', currencySymbol: '$' },
  { code: 'PE', iso3: 'PER', name: 'Perú', dialCode: '+51', flag: '🇵🇪', currency: 'PEN', currencySymbol: 'S/' },
  { code: 'EC', iso3: 'ECU', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', currency: 'USD', currencySymbol: '$' },
  { code: 'PA', iso3: 'PAN', name: 'Panamá', dialCode: '+507', flag: '🇵🇦', currency: 'USD', currencySymbol: '$' },
  { code: 'BR', iso3: 'BRA', name: 'Brasil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$' },
  { code: 'VE', iso3: 'VEN', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', currency: 'VES', currencySymbol: 'Bs.' },
  { code: 'UY', iso3: 'URY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', currency: 'UYU', currencySymbol: '$' },
  { code: 'CR', iso3: 'CRI', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', currency: 'CRC', currencySymbol: '₡' },
  { code: 'GT', iso3: 'GTM', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', currency: 'GTQ', currencySymbol: 'Q' },
  { code: 'DO', iso3: 'DOM', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴', currency: 'DOP', currencySymbol: 'RD$' },
  { code: 'CA', iso3: 'CAN', name: 'Canadá', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', currencySymbol: '$' },
  { code: 'GB', iso3: 'GBR', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£' },
  { code: 'DE', iso3: 'DEU', name: 'Alemania', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€' },
  { code: 'FR', iso3: 'FRA', name: 'Francia', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€' },
  { code: 'IT', iso3: 'ITA', name: 'Italia', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', currencySymbol: '€' },
]

export const DEFAULT_COUNTRY: CountryData = COUNTRIES[0] // Colombia por defecto

export function findCountryByCode(code?: string): CountryData {
  if (!code) return DEFAULT_COUNTRY
  const upper = code.toUpperCase()
  return COUNTRIES.find((c) => c.code === upper || c.iso3 === upper) || DEFAULT_COUNTRY
}

export function findCountryByDialCode(dialCode?: string): CountryData | undefined {
  if (!dialCode) return undefined
  return COUNTRIES.find((c) => c.dialCode === dialCode)
}
