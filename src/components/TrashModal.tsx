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
        <h3 id="trash-title">Διαγραμμένοι</h3>
        <p className="hint">
          Μπορείτε να τους ξαναπροσθέσετε εντός 7 ημερών. Μετά διαγράφονται οριστικά.
        </p>

        {trashWithDays.length === 0 ? (
          <div className="empty-hint">Δεν υπάρχουν διαγραμμένα άτομα.</div>
        ) : (
          trashWithDays.map((item) => (
            <div key={item.person.id} className="trash-item">
              <div className="meta">
                <strong>{item.person.name}</strong>
                <span className="trash-role">{item.person.role}</span>
                <small>
                  {item.daysLeft === 0
                    ? 'Διαγράφεται οριστικά σήμερα'
                    : `Επαναφορά διαθέσιμη για ${item.daysLeft} ημέρ${item.daysLeft === 1 ? 'α' : 'ες'}`}
                </small>
              </div>
              <div className="trash-item-actions">
                <button
                  type="button"
                  className="btn btn-primary trash-restore-btn"
                  onClick={() => restorePerson(item.person.id)}
                >
                  <RotateCcw size={14} />
                  Επαναφορά
                </button>
                <button
                  type="button"
                  className="icon-btn danger"
                  title="Οριστική διαγραφή τώρα"
                  aria-label={`Οριστική διαγραφή ${item.person.name}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Να διαγραφεί οριστικά ο/η ${item.person.name}; Δεν θα μπορεί να επαναφερθεί.`,
                      )
                    ) {
                      permanentlyDeleteFromTrash(item.person.id)
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
