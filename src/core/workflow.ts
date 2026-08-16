import type { Estimate, EstimateItem, Job, PricingMode } from './types'
import { newId } from './storage'

export function calculateLineTotal(quantity: number, unitPrice: number): number {
  const safeQuantity = Number.isFinite(quantity) && quantity >= 0 ? quantity : 0
  const safeUnitPrice = Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0
  return Number((safeQuantity * safeUnitPrice).toFixed(2))
}

export function buildEstimateItem(input: {
  name: string
  pricingMode: PricingMode
  quantity: number
  unitPrice: number
}): EstimateItem {
  return {
    id: newId('item'),
    name: input.name,
    pricingMode: input.pricingMode,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    total: calculateLineTotal(input.quantity, input.unitPrice)
  }
}

export function estimateSubtotal(items: EstimateItem[]): number {
  return Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2))
}

export function createJobFromEstimate(estimate: Estimate): Job {
  return {
    id: newId('job'),
    estimateId: estimate.id,
    customerId: estimate.customerId,
    propertyId: estimate.propertyId,
    items: structuredClone(estimate.items),
    quotedTotal: estimate.subtotal,
    status: 'unscheduled',
    createdAt: new Date().toISOString()
  }
}
