import { SHOPS } from '../data/shops'
import { useStore } from '../store/StoreContext'
import { formatGreekDate, formatShortGreek, weekDates, weekStartISO } from '../utils/storage'
import { WEEKDAY_LABELS } from '../data/shops'

export function OverviewReview() {
  const { state } = useStore()

  // Εξαιρούμε το 'review' από τη λίστα καταστημάτων
  const displayShops = SHOPS.filter((s) => s.id !== 'review')

  // Ημερήσια προβολή
  const dayAssignments = state.assignments.filter(
    (a) => a.date === state.selectedDate
  )

  // Εβδομαδιαία προβολή
  const startISO = weekStartISO(state.selectedDate)
  const currentWeekDates = weekDates(startISO)

  return (
    <div className="review-page-container">
      <div className="review-header" style={{ marginBottom: '1rem' }}>
        <h2 className="panel-title" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
          {state.viewMode === 'daily'
            ? `Ημερήσια Επισκόπηση · ${formatGreekDate(state.selectedDate)}`
            : `Εβδομαδιαία Επισκόπηση · Εβδομάδα από ${formatGreekDate(startISO)}`}
        </h2>
      </div>
    {state.viewMode === 'weekly' && (
    <div className="landscape-hint">
        💡 <strong>Tip:</strong> Γυρίστε το κινητό οριζόντια!
    </div>
    )}
      <div className="review-table-wrapper">
        {state.viewMode === 'daily' ? (
          /* --- ΗΜΕΡΗΣΙΟ REVIEW --- */
          <table className="review-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Ξενοδοχείο / Κατάσταση</th>
                <th>Προσωπικό</th>
              </tr>
            </thead>
            <tbody>
              {displayShops.map((shop) => {
                const assignedPeople = dayAssignments
                  .filter((a) => a.shopId === shop.id)
                  .map((a) => state.people.find((p) => p.id === a.personId))
                  .filter(Boolean)

                return (
                  <tr 
                    key={shop.id} 
                    className={shop.id === 'off-days' ? 'off-days-row' : ''}
                  >
                    <td className="shop-cell">
                      <strong>{shop.name}</strong>
                    </td>
                    <td className="people-cell">
                      {assignedPeople.length === 0 ? (
                        <span className="empty-dash">—</span>
                      ) : (
                        <span className="review-names-text">
                          {assignedPeople.map((person, idx) => {
                            const isLast = idx === assignedPeople.length - 1
                            return `${person?.name}${isLast ? '.' : ', '}`
                          })}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          /* --- ΕΒΔΟΜΑΔΙΑΙΟ REVIEW --- */
          <table className="review-table weekly-review-table">
            <thead>
              <tr>
                <th style={{ minWidth: '150px' }}>Ξενοδοχείο</th>
                {currentWeekDates.map((date, i) => (
                  <th key={date} style={{ minWidth: '130px', textAlign: 'center' }}>
                    {WEEKDAY_LABELS[i]}
                    <br />
                    <small style={{ fontWeight: 'normal', opacity: 0.8 }}>
                      {formatShortGreek(date)}
                    </small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayShops.map((shop) => (
                <tr 
                  key={shop.id} 
                  className={shop.id === 'off-days' ? 'off-days-row' : ''}
                >
                  <td className="shop-cell">
                    <strong>{shop.name}</strong>
                  </td>
                  {currentWeekDates.map((date) => {
                    const cellAssignments = state.assignments.filter(
                      (a) => a.shopId === shop.id && a.date === date
                    )
                    const people = cellAssignments
                      .map((a) => state.people.find((p) => p.id === a.personId))
                      .filter(Boolean)

                    return (
                      <td key={date} style={{ verticalAlign: 'top', padding: '8px' }}>
                        {people.length === 0 ? (
                          <div style={{ textAlign: 'center', color: '#94a3b8' }}>—</div>
                        ) : (
                          <span className="review-names-text">
                            {people.map((p, idx) => {
                              const isLast = idx === people.length - 1
                              return `${p?.name}${isLast ? '.' : ', '}`
                            })}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}