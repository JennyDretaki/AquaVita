import type { Shop } from '../types'

export const SHOPS: Shop[] = [
  { id: 'grand', name: 'GRAND' },
  { id: 'esperides', name: 'ESPERIDES' },
  { id: 'cooks', name: 'COOKS' },
  { id: 'ammos', name: 'AMMOS' },
  { id: 'kahlua', name: 'KAHLUA' },
  { id: 'glaros', name: 'GLAROS' },
  { id: 'petousis', name: 'PETOUSIS' },
  { id: 'noble', name: 'NOBLE' },
  { id: 'ida-village', name: 'IDA VILLAGE' },
]

export const WEEKDAY_LABELS = ['Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ', 'Κυρ'] as const
