import { useDroppable } from '@dnd-kit/core'
import { X } from 'lucide-react'
import { WEEKDAY_LABELS } from '../data/shops'
import { useStore } from '../store/StoreContext'
import { formatGreekDate, formatShortGreek, weekDates, weekStartISO } from '../utils/storage'

function WeekSlot({ date }: { date: string }) {
  const { currentAssignments, state, removeAssignment } = useStore()
  const { setNodeRef, isOver } = useDroppable({
    id: `weekly-${date}`,
    data: { date, type: 'weekly-slot' },
  })

  const items = currentAssignments.filter((a) => a.date === date)

  return (
    <div ref={setNodeRef} className={`week-drop${isOver ? ' over' : ''}`}>
      {items.map((a) => {
        const person = state.people.find((p) => p.id === a.personId)
        return (
          <div key={a.id} className="week-assigned">
            <span>{person?.name ?? '—'}</span>
            <button type="button" aria-label="Αφαίρεση" onClick={() => removeAssignment(a.id)}>
              <X size={12} />
            </button>
          </div>
        )
      })}
      {items.length === 0 ? <div className="drop-placeholder" style={{ padding: 8, fontSize: '0.65rem' }}>Σύρετε εδώ</div> : null}
    </div>
  )
}

export function WeeklySchedule() {
  const { state } = useStore()
  const start = weekStartISO(state.selectedDate)
  const dates = weekDates(start)

  return (
    <section className="schedule-section">
      <div>
        <h2 className="panel-title">Εβδομαδιαίο πρόγραμμα</h2>
        <p className="panel-sub">Εβδομάδα από {formatGreekDate(start)}</p>
      </div>
      <div className="week-scroll">
        <div className="week-grid week-grid-single">
          {dates.map((date, i) => (
            <div key={`head-${date}`} className="week-day-head">
              {WEEKDAY_LABELS[i]}
              <small>{formatShortGreek(date)}</small>
            </div>
          ))}
          {dates.map((date) => (
            <WeekSlot key={date} date={date} />
          ))}
        </div>
      </div>
    </section>
  )
}
