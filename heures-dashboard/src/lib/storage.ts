import type { AppData, Targets } from '../types'

const STORAGE_KEY = 'heures-dashboard-v1'

export const DEFAULT_TARGETS: Targets = {
  dayMin: 7,
  dayMax: 8,
  weekMin: 35,
  weekMax: 39,
  workDays: [1, 2, 3, 4, 5], // lun–ven
}

export const DEFAULT_DATA: AppData = {
  targets: DEFAULT_TARGETS,
  entries: {},
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      targets: { ...DEFAULT_TARGETS, ...parsed.targets },
      entries: parsed.entries ?? {},
    }
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
