import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { Person } from '../types'
import { useStore } from '../store/StoreContext'

function DraggablePerson({
  person,
  onSoftDelete,
}: {
  person: Person
  onSoftDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `person-${person.id}`,
    data: { personId: person.id, type: 'person' },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`person-chip${isDragging ? ' dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="grip" size={16} />
      <div className="person-meta">
        <strong>{person.name}</strong>
        <span>{person.role}</span>
      </div>
      <button
        type="button"
        className="trash-btn"
        title="Μόνιμη αφαίρεση (κάδος 7 ημερών)"
        aria-label={`Αφαίρεση ${person.name}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          if (window.confirm(`Να μεταφερθεί ο/η ${person.name} στον κάδο; (διαγραφή μετά από 7 ημέρες)`)) {
            onSoftDelete(person.id)
          }
        }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

interface PeoplePoolProps {
  onAdd: () => void
  onOpenTrash: () => void
}

export function PeoplePool({ onAdd, onOpenTrash }: PeoplePoolProps) {
  const { availablePeople, softDeletePerson, state } = useStore()

  return (
    <section className="people-section">
      <div className="people-header">
        <div>
          <h2>Προσωπικό</h2>
          <p className="panel-sub" style={{ margin: 0 }}>
            {state.viewMode === 'daily'
              ? 'Στο ημερήσιο αφαιρούνται όσοι τοποθετηθούν'
              : 'Στο εβδομαδιαίο παραμένουν διαθέσιμοι'}
          </p>
        </div>
        <div className="people-actions">
          <button type="button" className="icon-btn" title="Προσθήκη" onClick={onAdd}>
            <Plus size={18} />
          </button>
          <button type="button" className="icon-btn danger" title="Κάδος" onClick={onOpenTrash}>
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="people-list">
        {availablePeople.length === 0 ? (
          <div className="empty-hint">
            {state.people.length === 0
              ? 'Δεν υπάρχει προσωπικό. Προσθέστε άτομο.'
              : 'Όλοι έχουν τοποθετηθεί στο ημερήσιο πρόγραμμα.'}
          </div>
        ) : (
          availablePeople.map((person) => (
            <DraggablePerson key={person.id} person={person} onSoftDelete={softDeletePerson} />
          ))
        )}
      </div>
    </section>
  )
}
