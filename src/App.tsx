import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { ServiceCoreData } from './core/types'
import { loadData, newId, saveData } from './core/storage'
import { buildEstimateItem, createJobFromEstimate, estimateSubtotal } from './core/workflow'
import { pressureWashingServices } from './washflow/defaults'
import './styles.css'

type View = 'home' | 'customer' | 'lead' | 'estimate' | 'estimateDetail' | 'jobs'

const initialData: ServiceCoreData = {
  customers: [], properties: [], leads: [], estimates: [], jobs: [], serviceTemplates: pressureWashingServices
}

export default function App() {
  const [data, setData] = useState<ServiceCoreData>(initialData)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<View>('home')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [selectedEstimateId, setSelectedEstimateId] = useState('')

  useEffect(() => {
    loadData().then((stored) => {
      setData({ ...stored, serviceTemplates: stored.serviceTemplates.length ? stored.serviceTemplates : pressureWashingServices })
      setReady(true)
    }).catch(() => setReady(true))
  }, [])

  useEffect(() => { if (ready) void saveData(data) }, [data, ready])

  const latestEstimate = useMemo(() => data.estimates.at(-1), [data.estimates])
  if (!ready) return <main className="shell"><p>Loading WashFlow…</p></main>

  const addCustomer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customerId = newId('customer')
    const propertyId = newId('property')
    const now = new Date().toISOString()
    setData((current) => ({ ...current,
      customers: [...current.customers, { id: customerId, name: String(form.get('name') || '').trim(), phone: String(form.get('phone') || '').trim(), email: String(form.get('email') || '').trim(), createdAt: now }],
      properties: [...current.properties, { id: propertyId, customerId, address: String(form.get('address') || '').trim(), city: String(form.get('city') || '').trim(), state: String(form.get('state') || '').trim(), postalCode: String(form.get('postalCode') || '').trim(), createdAt: now }]
    }))
    setSelectedCustomerId(customerId); setSelectedPropertyId(propertyId); setView('lead')
  }

  const addLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const services = data.serviceTemplates.filter((service) => form.get(service.id) === 'on').map((service) => service.name)
    if (!services.length) return
    const id = newId('lead')
    setData((current) => ({ ...current, leads: [...current.leads, { id, customerId: selectedCustomerId, propertyId: selectedPropertyId, requestedServices: services, status: 'new', notes: String(form.get('notes') || '').trim(), createdAt: new Date().toISOString() }] }))
    setSelectedLeadId(id); setView('estimate')
  }

  const addEstimate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const lead = data.leads.find((item) => item.id === selectedLeadId)
    if (!lead) return
    const items = lead.requestedServices.map((name) => {
      const service = data.serviceTemplates.find((item) => item.name === name)!
      return buildEstimateItem({ name, pricingMode: service.pricingMode, quantity: Number(form.get(`${service.id}-quantity`) || 1), unitPrice: Number(form.get(`${service.id}-price`) || service.defaultUnitPrice) })
    })
    const estimateId = newId('estimate')
    setData((current) => ({ ...current,
      leads: current.leads.map((item) => item.id === lead.id ? { ...item, status: 'quoted' } : item),
      estimates: [...current.estimates, { id: estimateId, leadId: lead.id, customerId: lead.customerId, propertyId: lead.propertyId, items, subtotal: estimateSubtotal(items), status: 'draft', createdAt: new Date().toISOString() }]
    }))
    setSelectedEstimateId(estimateId); setView('estimateDetail')
  }

  const setEstimateStatus = (status: 'sent' | 'declined') => {
    setData((current) => ({ ...current, estimates: current.estimates.map((item) => item.id === selectedEstimateId ? { ...item, status } : item) }))
  }

  const acceptEstimate = () => {
    const estimate = data.estimates.find((item) => item.id === selectedEstimateId)
    if (!estimate || data.jobs.some((job) => job.estimateId === estimate.id)) return
    const job = createJobFromEstimate(estimate)
    setData((current) => ({ ...current,
      estimates: current.estimates.map((item) => item.id === estimate.id ? { ...item, status: 'accepted', acceptedAt: new Date().toISOString() } : item),
      leads: current.leads.map((item) => item.id === estimate.leadId ? { ...item, status: 'accepted' } : item),
      jobs: [...current.jobs, job]
    }))
    setView('jobs')
  }

  const customer = data.customers.find((item) => item.id === selectedCustomerId)
  const property = data.properties.find((item) => item.id === selectedPropertyId)
  const lead = data.leads.find((item) => item.id === selectedLeadId)
  const selectedEstimate = data.estimates.find((item) => item.id === selectedEstimateId)

  return <div className="app">
    <header className="topbar"><div><span className="eyebrow">Pressure washing CRM</span><h1>WashFlow</h1></div><span className="local-pill">Local-first</span></header>

    {view === 'home' && <main className="shell">
      <section className="hero-card"><span className="eyebrow">Today</span><h2>Quote to paid, without the clutter.</h2><p>Customers, properties, quotes and accepted jobs stay on this device.</p><button className="primary" onClick={() => setView('customer')}>+ New Lead</button></section>
      <section className="metric-grid"><article><strong>{data.customers.length}</strong><span>Customers</span></article><article><strong>{data.estimates.length}</strong><span>Estimates</span></article><article><strong>{data.jobs.length}</strong><span>Jobs</span></article></section>
      <section className="panel"><div className="section-heading"><h3>Recent quotes</h3><span>{data.estimates.length ? 'Saved locally' : 'Ready for first lead'}</span></div>
        {!data.estimates.length ? <p className="muted">Create a lead and quote to begin.</p> : <div className="activity-list">{data.estimates.slice().reverse().map((estimate) => {
          const c = data.customers.find((item) => item.id === estimate.customerId); const p = data.properties.find((item) => item.id === estimate.propertyId)
          return <button className="activity activity-button" key={estimate.id} onClick={() => { setSelectedEstimateId(estimate.id); setView('estimateDetail') }}><div><strong>{c?.name}</strong><span>{p?.address}</span><small>{estimate.items.map((item) => item.name).join(' · ')}</small></div><div className="activity-right"><span className={`status ${estimate.status}`}>{estimate.status}</span><strong>${estimate.subtotal.toFixed(2)}</strong></div></button>
        })}</div>}
      </section>
      {latestEstimate && <section className="success-card"><strong>Local persistence active</strong><span>Latest quote: ${latestEstimate.subtotal.toFixed(2)}.</span></section>}
    </main>}

    {view === 'customer' && <main className="shell narrow"><Step title="1. Customer & property" subtitle="Start with the minimum needed to quote the job." onBack={() => setView('home')} /><form className="form-card" onSubmit={addCustomer}><label>Name<input name="name" required placeholder="John Smith" /></label><div className="two-col"><label>Phone<input name="phone" inputMode="tel" /></label><label>Email<input name="email" type="email" /></label></div><label>Property address<input name="address" required placeholder="123 Main Street" /></label><div className="address-grid"><label>City<input name="city" /></label><label>State<input name="state" maxLength={2} /></label><label>ZIP<input name="postalCode" inputMode="numeric" /></label></div><button className="primary full" type="submit">Continue to services</button></form></main>}

    {view === 'lead' && customer && property && <main className="shell narrow"><Step title="2. Requested services" subtitle={`${customer.name} · ${property.address}`} onBack={() => setView('customer')} /><form className="form-card" onSubmit={addLead}><div className="service-grid">{data.serviceTemplates.map((service) => <label className="service-option" key={service.id}><input type="checkbox" name={service.id} /><span><strong>{service.name}</strong><small>{service.pricingMode === 'sqft' ? 'per sq ft' : service.pricingMode === 'linear_ft' ? 'per linear ft' : service.pricingMode}</small></span></label>)}</div><label>Lead notes<textarea name="notes" rows={3} /></label><button className="primary full" type="submit">Create lead & quote</button></form></main>}

    {view === 'estimate' && lead && <main className="shell narrow"><Step title="3. Build estimate" subtitle="Use the trade templates, then adjust quantity or rate." onBack={() => setView('lead')} /><form className="form-card" onSubmit={addEstimate}>{lead.requestedServices.map((name) => { const service = data.serviceTemplates.find((item) => item.name === name)!; return <div className="estimate-row" key={service.id}><div><strong>{name}</strong><small>{service.pricingMode.replace('_', ' ')}</small></div><label>Qty<input name={`${service.id}-quantity`} type="number" min="0" step="0.01" defaultValue="1" required /></label><label>Rate<input name={`${service.id}-price`} type="number" min="0" step="0.01" defaultValue={service.defaultUnitPrice} required /></label></div> })}<button className="primary full" type="submit">Save quote</button></form></main>}

    {view === 'estimateDetail' && selectedEstimate && <main className="shell narrow"><Step title="Quote" subtitle={`Created ${new Date(selectedEstimate.createdAt).toLocaleDateString()}`} onBack={() => setView('home')} /><section className="form-card"><div className="section-heading"><h3>${selectedEstimate.subtotal.toFixed(2)}</h3><span className={`status ${selectedEstimate.status}`}>{selectedEstimate.status}</span></div>{selectedEstimate.items.map((item) => <div className="quote-line" key={item.id}><span>{item.name}<small>{item.quantity} × ${item.unitPrice.toFixed(2)}</small></span><strong>${item.total.toFixed(2)}</strong></div>)}<div className="quote-actions"><button className="secondary" onClick={() => setEstimateStatus('sent')} disabled={selectedEstimate.status === 'accepted'}>Mark sent</button><button className="secondary" onClick={() => setEstimateStatus('declined')} disabled={selectedEstimate.status === 'accepted'}>Decline</button><button className="primary" onClick={acceptEstimate} disabled={selectedEstimate.status === 'accepted'}>{selectedEstimate.status === 'accepted' ? 'Job created' : 'Accept → Create job'}</button></div></section></main>}

    {view === 'jobs' && <main className="shell"><section className="panel"><div className="section-heading"><h3>Jobs</h3><span>{data.jobs.length} total</span></div>{!data.jobs.length ? <p className="muted">Accepted estimates become jobs here.</p> : <div className="activity-list">{data.jobs.slice().reverse().map((job) => { const c = data.customers.find((item) => item.id === job.customerId); const p = data.properties.find((item) => item.id === job.propertyId); return <article className="activity" key={job.id}><div><strong>{c?.name}</strong><span>{p?.address}</span><small>{job.items.map((item) => item.name).join(' · ')}</small></div><div className="activity-right"><span className={`status ${job.status}`}>{job.status.replace('_', ' ')}</span><strong>${job.quotedTotal.toFixed(2)}</strong></div></article> })}</div>}</section></main>}

    <nav className="bottom-nav"><button onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>Home</button><button disabled>Customers</button><button onClick={() => setView('jobs')} className={view === 'jobs' ? 'active' : ''}>Jobs</button><button disabled>Money</button></nav>
  </div>
}

function Step({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return <div className="step-heading"><button className="back" onClick={onBack}>←</button><div><span className="eyebrow">WashFlow workflow</span><h2>{title}</h2><p>{subtitle}</p></div></div>
}
