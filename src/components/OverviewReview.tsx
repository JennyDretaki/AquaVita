import { SHOPS } from '../data/shops'
import { useStore } from '../store/StoreContext'
import { formatGreekDate } from '../utils/storage'
import { Download } from 'lucide-react'
import { exportScheduleToExcel } from '../utils/excel'

export function OverviewReview() {
  const { state } = useStore()

  // Φιλτράρισμα ξενοδοχείων (εξαιρούμε το ίδιο το 'review' από τη λίστα)
  const displayShops = SHOPS.filter((s) => s.id !== 'review')

  const dayAssignments = state.assignments.filter(
    (a) => a.date === state.selectedDate
  )

  function handleSave() {
    exportScheduleToExcel({
      viewMode: state.viewMode,
      selectedDate: state.selectedDate,
      shopId: state.selectedShopId,
      assignments: state.assignments,
      people: state.people,
    })
  }

  return (
    <div className="review-page-container" style={{ width: '100%', padding: '1rem' }}>
      <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="panel-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Review
          </h2>
          <p className="panel-sub">{formatGreekDate(state.selectedDate)}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <Download size={16} style={{ marginRight: '6px' }} />
          Excel
        </button>
      </div>

      <div className="review-table-wrapper" style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="review-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', width: '220px' }}>
                Ξενοδοχείο / Κατάσταση
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>
                Ονόματα Προσωπικού
              </th>
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
                  style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: shop.id === 'off-days' ? '#fef2f2' : 'transparent' 
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {shop.name}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {assignedPeople.length === 0 ? (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {assignedPeople.map((person) => (
                          <span 
                            key={person?.id} 
                            style={{ 
                              background: '#e0f2fe', 
                              color: '#0369a1', 
                              padding: '6px 12px', 
                              borderRadius: '16px', 
                              fontSize: '0.875rem', 
                              fontWeight: 500,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {person?.name} <small style={{ opacity: 0.8 }}>({person?.role})</small>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}