import { useDroppable } from '@dnd-kit/core'
import { X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { formatGreekDate } from '../utils/storage'

export function DailySchedule() {
  const { state, currentAssignments, removeAssignment } = useStore()
  const { setNodeRef, isOver } = useDroppable({
    id: 'daily-slot',
    data: { type: 'daily-slot' },
  })

  return (
    <section className="schedule-section">
      <div>
        <h2 className="panel-title">Ημερήσιο πρόγραμμα</h2>
        <p className="panel-sub">{formatGreekDate(state.selectedDate)}</p>
      </div>

      <div className="shift-block">
        <div className="shift-head">Βάρδια</div>
        <div ref={setNodeRef} className={`drop-zone${isOver ? ' over' : ''}`}>
          {currentAssignments.length === 0 ? (
            <div className="drop-placeholder">Σύρετε άτομο εδώ</div>
          ) : (
            currentAssignments.map((a) => {
              const person = state.people.find((p) => p.id === a.personId)
              return (
                <div key={a.id} className="assigned-row">
                  <strong>{person?.name ?? '—'}</strong>
                  <span className="role">{person?.role}</span>
                  <button
                    type="button"
                    className="remove-x"
                    aria-label="Αφαίρεση"
                    onClick={() => removeAssignment(a.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
