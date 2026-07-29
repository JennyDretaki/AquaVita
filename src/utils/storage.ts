import { addDays, format, parseISO, startOfWeek, differenceInCalendarDays } from 'date-fns'
import { el } from 'date-fns/locale'
import type { AppState, Person, TrashedPerson } from '../types'
import { SHOPS } from '../data/shops'

const STORAGE_KEY = 'aquavita-hr-v2'
const TRASH_RETENTION_DAYS = 7

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function weekStartISO(dateISO: string): string {
  return format(startOfWeek(parseISO(dateISO), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function weekDates(weekStart: string): string[] {
  const start = parseISO(weekStart)
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'))
}

export function formatGreekDate(dateISO: string): string {
  return format(parseISO(dateISO), 'd MMMM yyyy', { locale: el })
}

export function formatShortGreek(dateISO: string): string {
  return format(parseISO(dateISO), 'd/M', { locale: el })
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const SEED_PEOPLE: Person[] = [
  { id: 'p1', name: 'Μαρία Παπαδοπούλου', role: 'Σερβιτόρα' },
  { id: 'p2', name: 'Γιάννης Νικολάου', role: 'Μπάρμαν' },
  { id: 'p3', name: 'Ελένη Κωστοπούλου', role: 'Reception' },
  { id: 'p4', name: 'Νίκος Αντωνίου', role: 'Μάγειρας' },
  { id: 'p5', name: 'Σοφία Δημητρίου', role: 'Σερβιτόρα' },
  { id: 'p6', name: 'Κώστας Μητσάκης', role: 'Βοηθός κουζίνας' },
  { id: 'p7', name: 'Άννα Βασιλείου', role: 'Hostess' },
  { id: 'p8', name: 'Δημήτρης Χατζής', role: 'Μπάρμαν' },
  { id: 'p9', name: 'Χριστίνα Λάμπρου', role: 'Σερβιτόρα' },
  { id: 'p10', name: 'Πέτρος Ιωάννου', role: 'Μάγειρας' },
]

function defaultState(): AppState {
  return {
    people: SEED_PEOPLE,
    trash: [],
    assignments: [],
    selectedShopId: SHOPS[0].id,
    viewMode: 'daily',
    selectedDate: todayISO(),
  }
}

export function purgeExpiredTrash(trash: TrashedPerson[]): TrashedPerson[] {
  const now = new Date()
  return trash.filter((item) => {
    const deleted = parseISO(item.deletedAt)
    return differenceInCalendarDays(now, deleted) < TRASH_RETENTION_DAYS
  })
}

export function daysLeftInTrash(deletedAt: string): number {
  const deleted = parseISO(deletedAt)
  const elapsed = differenceInCalendarDays(new Date(), deleted)
  return Math.max(0, TRASH_RETENTION_DAYS - elapsed)
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    return {
      ...defaultState(),
      ...parsed,
      trash: purgeExpiredTrash(parsed.trash ?? []),
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
