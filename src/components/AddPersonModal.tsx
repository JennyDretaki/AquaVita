import { useState, type FormEvent } from 'react'
import { useStore } from '../store/StoreContext'

interface AddPersonModalProps {
  open: boolean
  onClose: () => void
}

export function AddPersonModal({ open, onClose }: AddPersonModalProps) {
  const { addPerson } = useStore()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  if (!open) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addPerson(name, role)
    setName('')
    setRole('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-labelledby="add-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="add-title">Νέο άτομο</h3>
        <p className="hint">Προσθέστε μέλος προσωπικού στη λίστα επιλογής.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="person-name">Ονοματεπώνυμο</label>
            <input
              id="person-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="π.χ. Μαρία Παπαδοπούλου"
              autoFocus
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="person-role">Θέση</label>
            <input
              id="person-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="π.χ. Σερβιτόρα"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Ακύρωση
            </button>
            <button type="submit" className="btn btn-primary">
              Προσθήκη
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
