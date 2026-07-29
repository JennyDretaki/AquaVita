import { RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'

interface TrashModalProps {
  open: boolean
  onClose: () => void
}

export function TrashModal({ open, onClose }: TrashModalProps) {
  const { trashWithDays, restorePerson, permanentlyDeleteFromTrash } = useStore()

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-labelledby="trash-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="trash-title">Κάδος απορριμμάτων</h3>
        <p className="hint">Τα άτομα παραμένουν εδώ για 7 ημέρες και μετά διαγράφονται οριστικά.</p>

        {trashWithDays.length === 0 ? (
          <div className="empty-hint">Ο κάδος είναι άδειος.</div>
        ) : (
          trashWithDays.map((item) => (
            <div key={item.person.id} className="trash-item">
              <div className="meta">
                <strong>{item.person.name}</strong>
                <small>
                  {item.daysLeft === 0
                    ? 'Διαγράφεται σήμερα'
                    : `${item.daysLeft} ημέρ${item.daysLeft === 1 ? 'α' : 'ες'} ακόμα`}
                </small>
              </div>
              <button
                type="button"
                className="icon-btn"
                title="Επαναφορά"
                onClick={() => restorePerson(item.person.id)}
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                className="icon-btn danger"
                title="Οριστική διαγραφή"
                onClick={() => permanentlyDeleteFromTrash(item.person.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  )
}
