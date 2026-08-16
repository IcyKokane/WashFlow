export type Id = string

export interface Customer {
  id: Id
  name: string
  phone?: string
  email?: string
  createdAt: string
}

export interface Property {
  id: Id
  customerId: Id
  address: string
  city?: string
  state?: string
  postalCode?: string
  notes?: string
  createdAt: string
}

export type LeadStatus = 'new' | 'quoted' | 'accepted' | 'scheduled' | 'closed'

export interface Lead {
  id: Id
  customerId: Id
  propertyId: Id
  requestedServices: string[]
  status: LeadStatus
  notes?: string
  createdAt: string
}

export type PricingMode = 'flat' | 'sqft' | 'linear_ft' | 'custom'

export interface EstimateItem {
  id: Id
  name: string
  pricingMode: PricingMode
  quantity: number
  unitPrice: number
  total: number
}

export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined'

export interface Estimate {
  id: Id
  leadId: Id
  customerId: Id
  propertyId: Id
  items: EstimateItem[]
  subtotal: number
  status: EstimateStatus
  createdAt: string
}

export interface ServiceTemplate {
  id: Id
  name: string
  pricingMode: PricingMode
  defaultUnitPrice: number
}

export interface ServiceCoreData {
  customers: Customer[]
  properties: Property[]
  leads: Lead[]
  estimates: Estimate[]
  serviceTemplates: ServiceTemplate[]
}
