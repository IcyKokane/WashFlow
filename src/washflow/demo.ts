import type { ServiceCoreData } from '../core/types'
import { pressureWashingServices } from './defaults'

export function createDemoData(): ServiceCoreData {
  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 86_400_000).toISOString()
  const yesterday = new Date(now.getTime() - 86_400_000).toISOString()
  const nextWeek = new Date(now.getTime() + 7 * 86_400_000).toISOString().slice(0, 10)

  return {
    customers: [
      { id: 'demo_customer_1', name: 'Jordan Lee', phone: '555-0134', email: 'jordan@example.com', createdAt: threeDaysAgo },
      { id: 'demo_customer_2', name: 'Casey Morgan', phone: '555-0188', email: 'casey@example.com', createdAt: yesterday }
    ],
    properties: [
      { id: 'demo_property_1', customerId: 'demo_customer_1', address: '1824 Cedar Way', city: 'Gresham', state: 'OR', postalCode: '97030', createdAt: threeDaysAgo },
      { id: 'demo_property_2', customerId: 'demo_customer_2', address: '77 Meadow Lane', city: 'Gresham', state: 'OR', postalCode: '97080', createdAt: yesterday }
    ],
    leads: [
      { id: 'demo_lead_1', customerId: 'demo_customer_1', propertyId: 'demo_property_1', requestedServices: ['House Wash', 'Driveway'], status: 'quoted', createdAt: threeDaysAgo },
      { id: 'demo_lead_2', customerId: 'demo_customer_2', propertyId: 'demo_property_2', requestedServices: ['Driveway'], status: 'scheduled', createdAt: yesterday }
    ],
    estimates: [
      { id: 'demo_estimate_1', leadId: 'demo_lead_1', customerId: 'demo_customer_1', propertyId: 'demo_property_1', items: [{ id: 'demo_item_1', name: 'House Wash', pricingMode: 'sqft', quantity: 1800, unitPrice: 0.15, total: 270 }, { id: 'demo_item_2', name: 'Driveway', pricingMode: 'sqft', quantity: 650, unitPrice: 0.12, total: 78 }], subtotal: 348, status: 'sent', createdAt: threeDaysAgo, sentAt: threeDaysAgo },
      { id: 'demo_estimate_2', leadId: 'demo_lead_2', customerId: 'demo_customer_2', propertyId: 'demo_property_2', items: [{ id: 'demo_item_3', name: 'Driveway', pricingMode: 'sqft', quantity: 900, unitPrice: 0.12, total: 108 }], subtotal: 108, status: 'accepted', createdAt: yesterday, acceptedAt: yesterday }
    ],
    jobs: [
      { id: 'demo_job_1', estimateId: 'demo_estimate_2', customerId: 'demo_customer_2', propertyId: 'demo_property_2', items: [{ id: 'demo_item_3', name: 'Driveway', pricingMode: 'sqft', quantity: 900, unitPrice: 0.12, total: 108 }], quotedTotal: 108, status: 'scheduled', scheduledFor: new Date(now.getTime() + 2 * 86_400_000).toISOString().slice(0, 16), createdAt: yesterday }
    ],
    jobPhotos: [],
    invoices: [
      { id: 'demo_invoice_1', jobId: 'demo_job_old', customerId: 'demo_customer_1', propertyId: 'demo_property_1', items: [{ id: 'demo_invoice_item', name: 'Driveway', pricingMode: 'sqft', quantity: 1, unitPrice: 175, total: 175 }], total: 175, status: 'unpaid', dueDate: nextWeek, createdAt: yesterday }
    ],
    serviceTemplates: pressureWashingServices
  }
}
