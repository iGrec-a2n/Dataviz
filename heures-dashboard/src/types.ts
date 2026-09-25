export type DayStatus = 'empty' | 'under' | 'ok' | 'over'

export interface Targets {
  /** Heures minimum par jour travaillé */
  dayMin: number
  /** Heures maximum par jour travaillé */
  dayMax: number
  /** Heures minimum par semaine */
  weekMin: number
  /** Heures maximum par semaine */
  weekMax: number
  /** Jours travaillés (0 = dimanche … 6 = samedi), défaut lun–ven */
  workDays: number[]
}

export interface DayEntry {
  /** ISO date YYYY-MM-DD */
  date: string
  hours: number
}

export interface AppData {
  targets: Targets
  entries: Record<string, number>
}

export interface WeekSummary {
  /** Lundi de la semaine (ISO) */
  weekStart: string
  label: string
  total: number
  targetMid: number
  balance: number
  status: DayStatus
}
