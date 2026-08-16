import type { ServiceCoreData } from './types'

export interface AttentionItem {
  id: string
  kind: 'quote' | 'invoice' | 'job'
  title: string
  detail: string
  severity: 'normal' | 'urgent'
}

const DAY = 86_400_000

export function getNeedsAttention(data: ServiceCoreData, now = new Date()): AttentionItem[] {
  const items: AttentionItem[] = []

  for (const estimate of data.estimates) {
    if (estimate.status !== 'sent') continue
    const sentAt = new Date(estimate.sentAt ?? estimate.createdAt)
    if (now.getTime() - sentAt.getTime() < 3 * DAY) continue
    const customer = data.customers.find((item) => item.id === estimate.customerId)
    items.push({ id: `quote-${estimate.id}`, kind: 'quote', title: `${customer?.name ?? 'Customer'} needs quote follow-up`, detail: `$${estimate.subtotal.toFixed(2)} quote has been waiting 3+ days`, severity: 'normal' })
  }

  for (const job of data.jobs) {
    if (job.status !== 'unscheduled') continue
    const customer = data.customers.find((item) => item.id === job.customerId)
    items.push({ id: `job-${job.id}`, kind: 'job', title: `${customer?.name ?? 'Customer'} needs scheduling`, detail: `$${job.quotedTotal.toFixed(2)} accepted job is unscheduled`, severity: 'normal' })
  }

  for (const invoice of data.invoices) {
    if (invoice.status !== 'unpaid') continue
    const customer = data.customers.find((item) => item.id === invoice.customerId)
    const overdue = invoice.dueDate < now.toISOString().slice(0, 10)
    items.push({ id: `invoice-${invoice.id}`, kind: 'invoice', title: overdue ? `${customer?.name ?? 'Customer'} has an overdue invoice` : `${customer?.name ?? 'Customer'} has an unpaid invoice`, detail: `$${invoice.total.toFixed(2)} due ${invoice.dueDate}`, severity: overdue ? 'urgent' : 'normal' })
  }

  return items.sort((a, b) => Number(b.severity === 'urgent') - Number(a.severity === 'urgent'))
}
