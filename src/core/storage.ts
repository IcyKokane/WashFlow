import type { ServiceCoreData } from './types'

const DB_NAME = 'washflow'
const DB_VERSION = 1
const STORE = 'app'
const KEY = 'service-core-data'

const emptyData: ServiceCoreData = {
  customers: [],
  properties: [],
  leads: [],
  estimates: [],
  jobs: [],
  serviceTemplates: []
}

function normalizeData(value?: Partial<ServiceCoreData>): ServiceCoreData {
  return {
    customers: value?.customers ?? [],
    properties: value?.properties ?? [],
    leads: value?.leads ?? [],
    estimates: value?.estimates ?? [],
    jobs: value?.jobs ?? [],
    serviceTemplates: value?.serviceTemplates ?? []
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function loadData(): Promise<ServiceCoreData> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).get(KEY)
    request.onsuccess = () => resolve(request.result ? normalizeData(request.result) : structuredClone(emptyData))
    request.onerror = () => reject(request.error)
  })
}

export async function saveData(data: ServiceCoreData): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(data, KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}
