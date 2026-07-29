import type { Person } from '../types'

export const ROLES = ['Πωλητής', 'Θεραπευτής'] as const
export type StaffRole = (typeof ROLES)[number]

export type PeopleSortMode = 'role' | 'alpha'

const SALES: string[] = [
  'Σταθοπούλου',
  'Χιώτη',
  'Κριθινιδη',
  'Αναστασάκη',
  'Τζαβο Ειρήνη',
  'Τζαβο Αιμιλία',
  'Βασιλάκη',
  'Καρκανακη',
  'Γαλιατσατου',
  'Ερισα',
  'Μαυροφορακη',
]

const THERAPISTS: string[] = [
  'Μαρουση',
  'Φιλιππάκη',
  'Καναβάκη',
  'Μπουτζαλης',
  'Τσιρινη',
  'Zorayda',
  'Κιεσκου',
  'Ιωάννου',
  'Αναγνωστοπούλου',
  'Φλουρη',
  'Μωραιτης',
  'Κολιτσι',
  'Αναστασοβα',
  'Λασηθιωτακη',
  'Μανιαδη',
  'Αληγιαννη',
  'Μαυρικάκη',
  'Παναγιωτακη',
]

export const SEED_PEOPLE: Person[] = [
  ...SALES.map((name, i) => ({
    id: `sale-${i + 1}`,
    name,
    role: 'Πωλητής' as const,
  })),
  ...THERAPISTS.map((name, i) => ({
    id: `ther-${i + 1}`,
    name,
    role: 'Θεραπευτής' as const,
  })),
]

export function sortPeople(people: Person[], mode: PeopleSortMode): Person[] {
  const copy = [...people]
  if (mode === 'alpha') {
    return copy.sort((a, b) => a.name.localeCompare(b.name, 'el', { sensitivity: 'base' }))
  }

  const roleOrder = (role: string) => {
    if (role === 'Πωλητής') return 0
    if (role === 'Θεραπευτής') return 1
    return 2
  }

  return copy.sort((a, b) => {
    const byRole = roleOrder(a.role) - roleOrder(b.role)
    if (byRole !== 0) return byRole
    return a.name.localeCompare(b.name, 'el', { sensitivity: 'base' })
  })
}
