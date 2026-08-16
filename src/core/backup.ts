import type { ServiceCoreData } from './types'

export interface BackupEnvelope {
  format: 'washflow-backup'
  version: 1
  exportedAt: string
  data: ServiceCoreData
}

export function createBackup(data: ServiceCoreData): string {
  const payload: BackupEnvelope = { format: 'washflow-backup', version: 1, exportedAt: new Date().toISOString(), data }
  return JSON.stringify(payload, null, 2)
}

export function parseBackup(text: string): ServiceCoreData {
  const parsed = JSON.parse(text) as Partial<BackupEnvelope>
  if (parsed.format !== 'washflow-backup' || parsed.version !== 1 || !parsed.data) throw new Error('Invalid WashFlow backup')
  return parsed.data
}

export function downloadText(filename: string, content: string, type = 'application/json'): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: unknown): string {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function customersCsv(data: ServiceCoreData): string {
  const rows = [['name', 'phone', 'email', 'address', 'city', 'state', 'postal_code']]
  for (const customer of data.customers) {
    const properties = data.properties.filter((item) => item.customerId === customer.id)
    if (!properties.length) rows.push([customer.name, customer.phone ?? '', customer.email ?? '', '', '', '', ''])
    for (const property of properties) rows.push([customer.name, customer.phone ?? '', customer.email ?? '', property.address, property.city ?? '', property.state ?? '', property.postalCode ?? ''])
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

export function invoicesCsv(data: ServiceCoreData): string {
  const rows = [['customer', 'total', 'status', 'due_date', 'created_at', 'paid_at']]
  for (const invoice of data.invoices) {
    const customer = data.customers.find((item) => item.id === invoice.customerId)
    rows.push([customer?.name ?? '', invoice.total.toFixed(2), invoice.status, invoice.dueDate, invoice.createdAt, invoice.paidAt ?? ''])
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}
