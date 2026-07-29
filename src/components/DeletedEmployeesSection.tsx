import { RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'

export function DeletedEmployeesSection() {
  const { trashWithDays, restorePerson, permanentlyDeleteFromTrash } = useStore()

  return (
    <section className="people-section deleted-section">
      <div className="people-header">
        <div>
          <h2>Διαγεγραμμένοι υπάλληλοι</h2>
          <p className="panel-sub" style={{ margin: 0 }}>
            Επαναφορά εντός 7 ημερών · μετά διαγράφονται οριστικά
          </p>
        </div>
        {trashWithDays.length > 0 ? (
          <span className="deleted-count">{trashWithDays.length}</span>
        ) : null}
      </div>

      {trashWithDays.length === 0 ? (
        <div className="empty-hint">Δεν υπάρχουν διαγεγραμμένοι υπάλληλοι.</div>
      ) : (
        <div className="deleted-list">
          {trashWithDays.map((item) => (
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
          ))}
        </div>
      )}
    </section>
  )
}
