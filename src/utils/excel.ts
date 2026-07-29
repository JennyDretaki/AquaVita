import * as XLSX from 'xlsx'
import type { Assignment, Person, ViewMode } from '../types'
import { SHOPS, WEEKDAY_LABELS } from '../data/shops'
import { formatGreekDate, weekDates, weekStartISO } from './storage'

function personName(people: Person[], id: string): string {
  return people.find((p) => p.id === id)?.name ?? '—'
}

function personRole(people: Person[], id: string): string {
  return people.find((p) => p.id === id)?.role ?? ''
}

export function exportScheduleToExcel(opts: {
  viewMode: ViewMode
  selectedDate: string
  shopId: string
  assignments: Assignment[]
  people: Person[]
}): void {
  const shop = SHOPS.find((s) => s.id === opts.shopId)
  const shopName = shop?.name ?? opts.shopId

  if (opts.viewMode === 'daily') {
    const rows = opts.assignments
      .filter((a) => a.shopId === opts.shopId && a.date === opts.selectedDate)
      .map((a) => ({
        Μαγαζί: shopName,
        Ημερομηνία: formatGreekDate(opts.selectedDate),
        Ονοματεπώνυμο: personName(opts.people, a.personId),
        Θέση: personRole(opts.people, a.personId),
      }))

    const ws = XLSX.utils.json_to_sheet(
      rows.length
        ? rows
        : [{ Μαγαζί: shopName, Ημερομηνία: formatGreekDate(opts.selectedDate), Ονοματεπώνυμο: 'Κενό πρόγραμμα', Θέση: '' }],
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ημερήσιο')
    XLSX.writeFile(wb, `AquaVita_${shopName}_ημερησιο_${opts.selectedDate}.xlsx`)
    return
  }

  const start = weekStartISO(opts.selectedDate)
  const dates = weekDates(start)
  const header = dates.map((d, i) => `${WEEKDAY_LABELS[i]} ${d.slice(8)}/${d.slice(5, 7)}`)

  const namesRow = dates.map((date) => {
    const names = opts.assignments
      .filter((a) => a.shopId === opts.shopId && a.date === date)
      .map((a) => personName(opts.people, a.personId))
    return names.join(', ') || '—'
  })

  const sheetData: (string | number)[][] = [
    [`AquaVita — ${shopName} — Εβδομαδιαίο πρόγραμμα`],
    [`Εβδομάδα από ${formatGreekDate(start)}`],
    [],
    header,
    namesRow,
  ]

  const detailRows = opts.assignments
    .filter((a) => a.shopId === opts.shopId && dates.includes(a.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => ({
      Μαγαζί: shopName,
      Ημερομηνία: a.date,
      Ονοματεπώνυμο: personName(opts.people, a.personId),
      Θέση: personRole(opts.people, a.personId),
    }))

  const wb = XLSX.utils.book_new()
  const grid = XLSX.utils.aoa_to_sheet(sheetData)
  XLSX.utils.book_append_sheet(wb, grid, 'Πλέγμα')
  const detail = XLSX.utils.json_to_sheet(
    detailRows.length
      ? detailRows
      : [{ Μαγαζί: shopName, Ημερομηνία: '', Ονοματεπώνυμο: 'Κενό πρόγραμμα', Θέση: '' }],
  )
  XLSX.utils.book_append_sheet(wb, detail, 'Αναλυτικά')
  XLSX.writeFile(wb, `AquaVita_${shopName}_εβδομαδιαιο_${start}.xlsx`)
}
