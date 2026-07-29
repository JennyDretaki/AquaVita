import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Assignment, Person, ViewMode } from '../types'
import {
  daysLeftInTrash,
  loadState,
  purgeExpiredTrash,
  saveState,
  todayISO,
  uid,
  weekDates,
  weekStartISO,
} from '../utils/storage'

interface StoreApi {
  state: AppState
  setShop: (id: string) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedDate: (date: string) => void
  addPerson: (name: string, role: string) => void
  softDeletePerson: (personId: string) => void
  restorePerson: (personId: string) => void
  permanentlyDeleteFromTrash: (personId: string) => void
  assignPerson: (personId: string, date: string) => void
  removeAssignment: (assignmentId: string) => void
  clearCurrentSchedule: () => void
  availablePeople: Person[]
  currentAssignments: Assignment[]
  trashWithDays: { person: Person; deletedAt: string; daysLeft: number }[]
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    setState((prev) => {
      const cleaned = purgeExpiredTrash(prev.trash)
      if (cleaned.length === prev.trash.length) return prev
      return { ...prev, trash: cleaned }
    })
  }, [])

  useEffect(() => {
    saveState(state)
  }, [state])

  const setShop = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedShopId: id }))
  }, [])

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((s) => ({ ...s, viewMode: mode }))
  }, [])

  const setSelectedDate = useCallback((date: string) => {
    setState((s) => ({ ...s, selectedDate: date }))
  }, [])

  const addPerson = useCallback((name: string, role: string) => {
    const person: Person = { id: uid(), name: name.trim(), role: role.trim() || 'Προσωπικό' }
    setState((s) => ({ ...s, people: [...s.people, person] }))
  }, [])

  const softDeletePerson = useCallback((personId: string) => {
    setState((s) => {
      const person = s.people.find((p) => p.id === personId)
      if (!person) return s
      return {
        ...s,
        people: s.people.filter((p) => p.id !== personId),
        assignments: s.assignments.filter((a) => a.personId !== personId),
        trash: [...s.trash, { person, deletedAt: new Date().toISOString() }],
      }
    })
  }, [])

  const restorePerson = useCallback((personId: string) => {
    setState((s) => {
      const item = s.trash.find((t) => t.person.id === personId)
      if (!item) return s
      return {
        ...s,
        trash: s.trash.filter((t) => t.person.id !== personId),
        people: [...s.people, item.person],
      }
    })
  }, [])

  const permanentlyDeleteFromTrash = useCallback((personId: string) => {
    setState((s) => ({
      ...s,
      trash: s.trash.filter((t) => t.person.id !== personId),
    }))
  }, [])

  const assignPerson = useCallback((personId: string, date: string) => {
    setState((s) => {
      const exists = s.assignments.some(
        (a) => a.personId === personId && a.shopId === s.selectedShopId && a.date === date,
      )
      if (exists) return s

      const assignment: Assignment = {
        id: uid(),
        personId,
        shopId: s.selectedShopId,
        date,
      }
      return { ...s, assignments: [...s.assignments, assignment] }
    })
  }, [])

  const removeAssignment = useCallback((assignmentId: string) => {
    setState((s) => ({
      ...s,
      assignments: s.assignments.filter((a) => a.id !== assignmentId),
    }))
  }, [])

  const clearCurrentSchedule = useCallback(() => {
    setState((s) => {
      if (s.viewMode === 'daily') {
        return {
          ...s,
          assignments: s.assignments.filter(
            (a) => !(a.shopId === s.selectedShopId && a.date === s.selectedDate),
          ),
        }
      }
      const dates = weekDates(weekStartISO(s.selectedDate))
      return {
        ...s,
        assignments: s.assignments.filter(
          (a) => !(a.shopId === s.selectedShopId && dates.includes(a.date)),
        ),
      }
    })
  }, [])

  const currentAssignments = useMemo(() => {
    if (state.viewMode === 'daily') {
      return state.assignments.filter(
        (a) => a.shopId === state.selectedShopId && a.date === state.selectedDate,
      )
    }
    const dates = weekDates(weekStartISO(state.selectedDate))
    return state.assignments.filter(
      (a) => a.shopId === state.selectedShopId && dates.includes(a.date),
    )
  }, [state])

  const availablePeople = useMemo(() => {
    if (state.viewMode === 'weekly') return state.people

    const assignedIds = new Set(
      state.assignments
        .filter((a) => a.shopId === state.selectedShopId && a.date === state.selectedDate)
        .map((a) => a.personId),
    )
    return state.people.filter((p) => !assignedIds.has(p.id))
  }, [state])

  const trashWithDays = useMemo(
    () =>
      state.trash.map((t) => ({
        ...t,
        daysLeft: daysLeftInTrash(t.deletedAt),
      })),
    [state.trash],
  )

  const api: StoreApi = {
    state,
    setShop,
    setViewMode,
    setSelectedDate,
    addPerson,
    softDeletePerson,
    restorePerson,
    permanentlyDeleteFromTrash,
    assignPerson,
    removeAssignment,
    clearCurrentSchedule,
    availablePeople,
    currentAssignments,
    trashWithDays,
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { todayISO }
