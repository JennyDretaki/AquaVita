export interface Shop {
  id: string
  name: string
}

export interface Person {
  id: string
  name: string
  role: string
}

export interface TrashedPerson {
  person: Person
  deletedAt: string
}

export interface Assignment {
  id: string
  personId: string
  shopId: string
  /** YYYY-MM-DD */
  date: string
}

export type ViewMode = 'daily' | 'weekly'

export interface AppState {
  people: Person[]
  trash: TrashedPerson[]
  assignments: Assignment[]
  selectedShopId: string
  viewMode: ViewMode
  selectedDate: string
}
