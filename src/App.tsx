import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { EstimateItem, ServiceCoreData } from './core/types'
import { loadData, newId, saveData } from './core/storage'
import { pressureWashingServices } from './washflow/defaults'
import './styles.css'

type View = 'home' | 'customer' | 'lead' | 'estimate'

const initialData: ServiceCoreData = {
  customers: [],
  properties: [],
  leads: [],
  estimates: [],
  serviceTemplates: pressureWashingServices
}

export default function App() {
  const [data, setData] = useState<ServiceCoreData>(initialData)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<View>('home')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState('')

  useEffect(() => {
    loadData().then((stored) => {
      setData({ ...stored, serviceTemplates: stored.serviceTemplates.length ? stored.serviceTemplates : pressureWashingServices })
      setReady(true)
    }).catch(() => setReady(true))
  }, [])

  useEffect(() => {
    if (ready) void saveData(data)
  }, [data, ready])

  const latestEstimate = useMemo(() => data.estimates.at(-1), [data.estimates])

  if (!ready) return <main className="shell"><p>Loading WashFlow…</p></main>

  const addCustomer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customerId = newId('customer')
    const propertyId = newId('property')
    const now = new Date().toISOString()
    setData((current) => ({
      ...current,
      customers: [...current.customers, {
        id: customerId,
        name: String(form.get('name') || '').trim(),
        phone: String(form.get('phone') || '').trim(),
        email: String(form.get('email') || '').trim(),
        createdAt: now
      }],
      properties: [...current.properties, {
        id: propertyId,
        customerId,
        address: String(form.get('address') || '').trim(),
        city: String(form.get('city') || '').trim(),
        state: String(form.get('state') || '').trim(),
        postalCode: String(form.get('postalCode') || '').trim(),
        createdAt: now
      }]
    }))
    setSelectedCustomerId(customerId)
    setSelectedPropertyId(propertyId)
    setView('lead')
  }

  const addLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const services = data.serviceTemplates.filter((service) => form.get(service.id) === 'on').map((service) => service.name)
    const id = newId('lead')
    setData((current) => ({
      ...current,
      leads: [...current.leads, {
        id,
        customerId: selectedCustomerId,
        propertyId: selectedPropertyId,
        requestedServices: services,
        status: 'new',
        notes: String(form.get('notes') || '').trim(),
        createdAt: new Date().toISOString()
      }]
    }))
    setSelectedLeadId(id)
    setView('estimate')
  }

  const addEstimate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const lead = data.leads.find((item) => item.id === selectedLeadId)
    if (!lead) return

    const items: EstimateItem[] = lead.requestedServices.map((name) => {
      const service = data.serviceTemplates.find((item) => item.name === name)!
      const key = service.id
      const quantity = Number(form.get(`${key}-quantity`) || 1)
      const unitPrice = Number(form.get(`${key}-price`) || service.defaultUnitPrice)
      return {
        id: newId('item'),
        name,
        pricingMode: service.pricingMode,
        quantity,
        unitPrice,
        total: Number((quantity * unitPrice).toFixed(2))
      }
    })
    const subtotal = Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2))
    setData((current) => ({
      ...current,
      leads: current.leads.map((item) => item.id === lead.id ? { ...item, status: 'quoted' } : item),
      estimates: [...current.estimates, {
        id: newId('estimate'),
        leadId: lead.id,
        customerId: lead.customerId,
        propertyId: lead.propertyId,
        items,
        subtotal,
        status: 'draft',
        createdAt: new Date().toISOString()
      }]
    }))
    setView('home')
  }

  const customer = data.customers.find((item) => item.id === selectedCustomerId)
  const property = data.properties.find((item) => item.id === selectedPropertyId)
  const lead = data.leads.find((item) => item.id === selectedLeadId)

  return (
    <div className="app">
      <header className="topbar">
        <div><span className="eyebrow">Pressure washing CRM</span><h1>WashFlow</h1></div>
        <span className="local-pill">Local-first</span>
      </header>

      {view === 'home' && (
        <main className="shell">
          <section className="hero-card">
            <span className="eyebrow">Today</span>
            <h2>Quote to paid, without the clutter.</h2>
            <p>Day 1 foundation: customers, properties, leads and estimates persist on this device.</p>
            <button className="primary" onClick={() => setView('customer')}>+ New Lead</button>
          </section>

          <section className="metric-grid">
            <article><strong>{data.customers.length}</strong><span>Customers</span></article>
            <article><strong>{data.leads.length}</strong><span>Leads</span></article>
            <article><strong>{data.estimates.length}</strong><span>Estimates</span></article>
          </section>

          <section className="panel">
            <div className="section-heading"><h3>Recent activity</h3><span>{data.leads.length ? 'Saved locally' : 'Ready for first lead'}</span></div>
            {data.leads.length === 0 ? <p className="muted">Create a lead to exercise the complete Day 1 persistence path.</p> : (
              <div className="activity-list">
                {data.leads.slice().reverse().map((item) => {
                  const c = data.customers.find((candidate) => candidate.id === item.customerId)
                  const p = data.properties.find((candidate) => candidate.id === item.propertyId)
                  const estimate = data.estimates.find((candidate) => candidate.leadId === item.id)
                  return <article className="activity" key={item.id}>
                    <div><strong>{c?.name}</strong><span>{p?.address}</span><small>{item.requestedServices.join(' · ') || 'No services selected'}</small></div>
                    <div className="activity-right"><span className={`status ${item.status}`}>{item.status}</span>{estimate && <strong>${estimate.subtotal.toFixed(2)}</strong>}</div>
                  </article>
                })}
              </div>
            )}
          </section>

          {latestEstimate && <section className="success-card"><strong>Persistence checkpoint ready</strong><span>Close WashFlow and reopen it. This estimate should still be here: ${latestEstimate.subtotal.toFixed(2)}.</span></section>}
        </main>
      )}

      {view === 'customer' && (
        <main className="shell narrow">
          <Step title="1. Customer & property" subtitle="Start with the minimum needed to quote the job." onBack={() => setView('home')} />
          <form className="form-card" onSubmit={addCustomer}>
            <label>Name<input name="name" required placeholder="John Smith" /></label>
            <div className="two-col"><label>Phone<input name="phone" inputMode="tel" placeholder="555-555-1234" /></label><label>Email<input name="email" type="email" placeholder="john@example.com" /></label></div>
            <label>Property address<input name="address" required placeholder="123 Main Street" /></label>
            <div className="address-grid"><label>City<input name="city" /></label><label>State<input name="state" maxLength={2} /></label><label>ZIP<input name="postalCode" inputMode="numeric" /></label></div>
            <button className="primary full" type="submit">Continue to services</button>
          </form>
        </main>
      )}

      {view === 'lead' && customer && property && (
        <main className="shell narrow">
          <Step title="2. Requested services" subtitle={`${customer.name} · ${property.address}`} onBack={() => setView('customer')} />
          <form className="form-card" onSubmit={addLead}>
            <div className="service-grid">
              {data.serviceTemplates.map((service) => <label className="service-option" key={service.id}><input type="checkbox" name={service.id} /><span><strong>{service.name}</strong><small>{service.pricingMode === 'sqft' ? 'per sq ft' : service.pricingMode === 'linear_ft' ? 'per linear ft' : service.pricingMode}</small></span></label>)}
            </div>
            <label>Lead notes<textarea name="notes" rows={3} placeholder="Oil staining near garage, back gate access…" /></label>
            <button className="primary full" type="submit">Create lead & quote</button>
          </form>
        </main>
      )}

      {view === 'estimate' && lead && (
        <main className="shell narrow">
          <Step title="3. Build estimate" subtitle="Quantity × unit price. Change either field before saving." onBack={() => setView('lead')} />
          <form className="form-card" onSubmit={addEstimate}>
            {lead.requestedServices.length === 0 ? <p className="muted">No services were selected. Go back and select at least one service.</p> : lead.requestedServices.map((name) => {
              const service = data.serviceTemplates.find((item) => item.name === name)!
              return <div className="estimate-row" key={service.id}><div><strong>{name}</strong><small>{service.pricingMode.replace('_', ' ')}</small></div><label>Qty<input name={`${service.id}-quantity`} type="number" min="0" step="0.01" defaultValue="1" required /></label><label>Rate<input name={`${service.id}-price`} type="number" min="0" step="0.01" defaultValue={service.defaultUnitPrice} required /></label></div>
            })}
            <button className="primary full" type="submit" disabled={!lead.requestedServices.length}>Save estimate</button>
          </form>
        </main>
      )}

      <nav className="bottom-nav"><button onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>Home</button><button disabled>Customers</button><button disabled>Jobs</button><button disabled>Money</button></nav>
    </div>
  )
}

function Step({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return <div className="step-heading"><button className="back" onClick={onBack}>←</button><div><span className="eyebrow">Day 1 workflow</span><h2>{title}</h2><p>{subtitle}</p></div></div>
}
