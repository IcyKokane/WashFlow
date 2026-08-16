import type { ServiceTemplate } from '../core/types'

export const pressureWashingServices: ServiceTemplate[] = [
  { id: 'svc_house', name: 'House Wash', pricingMode: 'sqft', defaultUnitPrice: 0.15 },
  { id: 'svc_driveway', name: 'Driveway', pricingMode: 'sqft', defaultUnitPrice: 0.12 },
  { id: 'svc_sidewalk', name: 'Sidewalk', pricingMode: 'sqft', defaultUnitPrice: 0.12 },
  { id: 'svc_patio', name: 'Patio', pricingMode: 'sqft', defaultUnitPrice: 0.14 },
  { id: 'svc_deck', name: 'Deck', pricingMode: 'sqft', defaultUnitPrice: 0.18 },
  { id: 'svc_fence', name: 'Fence', pricingMode: 'linear_ft', defaultUnitPrice: 1.5 },
  { id: 'svc_roof', name: 'Roof Wash', pricingMode: 'sqft', defaultUnitPrice: 0.3 },
  { id: 'svc_gutters', name: 'Gutter Cleaning', pricingMode: 'linear_ft', defaultUnitPrice: 1.25 }
]
