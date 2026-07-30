import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { addDays, format, parseISO, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Download, Eraser } from 'lucide-react'
import { SHOPS } from './data/shops'
import { useStore } from './store/StoreContext'
import { ShopSidebar } from './components/ShopSidebar'
import { PeoplePool } from './components/PeoplePool'
import { DeletedEmployeesSection } from './components/DeletedEmployeesSection'
import { DailySchedule } from './components/DailySchedule'
import { WeeklySchedule } from './components/WeeklySchedule'
import { OverviewReview } from './components/OverviewReview'
import { AddPersonModal } from './components/AddPersonModal'
import { exportScheduleToExcel } from './utils/excel'
import { weekStartISO } from './utils/storage'

export default function App() {
  const {
    state,
    setViewMode,
    setSelectedDate,
    assignPerson,
    clearCurrentSchedule,
  } = useStore()

  const [addOpen, setAddOpen] = useState(false)
  const [activePersonId, setActivePersonId] = useState<string | null>(null)

  const isReviewMode = state.selectedShopId === 'review'
  const currentShop = SHOPS.find((s) => s.id === state.selectedShopId)
  const shopName = currentShop?.name ?? ''

  // Παρατεταμένο πάτημα (2s) για να μην ακυρώνεται το scroll στις φορητές συσκευές
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 2000, tolerance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 2000, tolerance: 8 } }),
  )

  const activePerson = useMemo(
    () => state.people.find((p) => p.id === activePersonId) ?? null,
    [state.people, activePersonId],
  )

  function shiftDate(delta: number) {
    const base = parseISO(state.selectedDate)
    const next =
      state.viewMode === 'weekly'
        ? addDays(base, delta * 7)
        : delta > 0
          ? addDays(base, 1)
          : subDays(base, 1)
    setSelectedDate(format(next, 'yyyy-MM-dd'))
  }

  function handleDragStart(event: DragStartEvent) {
    const personId = event.active.data.current?.personId as string | undefined
    setActivePersonId(personId ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePersonId(null)
    const { active, over } = event
    if (!over) return

    const personId = active.data.current?.personId as string | undefined
    if (!personId) return

    const overId = String(over.id)

    if (overId === 'daily-slot') {
      assignPerson(personId, state.selectedDate)
      return
    }

    if (overId.startsWith('weekly-')) {
      const date = over.data.current?.date as string | undefined
      if (!date) return
      assignPerson(personId, date)
    }
  }

  function handleExport() {
    exportScheduleToExcel({
      viewMode: state.viewMode,
      selectedDate: state.selectedDate,
      shopId: state.selectedShopId,
      assignments: state.assignments,
      people: state.people,
    })
  }

  function handleClearAll() {
    const label =
      state.viewMode === 'daily'
        ? 'το ημερήσιο πρόγραμμα αυτής της ημέρας'
        : 'το εβδομαδιαίο πρόγραμμα'
    if (window.confirm(`Να αφαιρεθούν όλοι από ${label} (${shopName});`)) {
      clearCurrentSchedule()
    }
  }

  return (
    <div className="app-shell">
      <ShopSidebar />

      <main className="main-panel">
        <header className="top-bar">
          <div className="top-bar-row top-bar-primary">
            {/* Ο τίτλος του Ξενοδοχείου / Ρεπό εμφανίζεται ΠΑΝΤΑ στην κορυφή */}
            <h1 className="active-shop-heading">{shopName}</h1>

            {!isReviewMode && (
              <div className="mode-toggle" role="tablist">
                <button
                  type="button"
                  className={state.viewMode === 'daily' ? 'active' : ''}
                  onClick={() => setViewMode('daily')}
                >
                  Ημερήσιο
                </button>
                <button
                  type="button"
                  className={state.viewMode === 'weekly' ? 'active' : ''}
                  onClick={() => setViewMode('weekly')}
                >
                  Εβδομαδιαίο
                </button>
              </div>
            )}

            {!isReviewMode && (
              <div className="action-row">
                <button type="button" className="btn btn-danger" onClick={handleClearAll}>
                  <Eraser size={15} />
                  <span className="label">Αφαίρεση όλων</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={handleExport}>
                  <Download size={15} />
                  <span className="label">Excel</span>
                </button>
              </div>
            )}
          </div>

          <div className="top-bar-row top-bar-date">
            <div className="date-controls">
              <button type="button" className="icon-btn" aria-label="Προηγούμενο" onClick={() => shiftDate(-1)}>
                <ChevronLeft size={18} />
              </button>
              <input
                type="date"
                value={
                  state.viewMode === 'weekly' ? weekStartISO(state.selectedDate) : state.selectedDate
                }
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Ημερομηνία"
              />
              <button type="button" className="icon-btn" aria-label="Επόμενο" onClick={() => shiftDate(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </header>

        {isReviewMode ? (
          <OverviewReview />
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActivePersonId(null)}
          >
            <div className="content">
              <PeoplePool onAdd={() => setAddOpen(true)} />
              {state.viewMode === 'daily' ? <DailySchedule /> : <WeeklySchedule />}
              <DeletedEmployeesSection />
            </div>

            <DragOverlay>
              {activePerson ? (
                <div className="drag-overlay-chip">{activePerson.name}</div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <AddPersonModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}