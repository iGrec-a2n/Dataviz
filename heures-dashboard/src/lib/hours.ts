import {
  addDays,
  addWeeks,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import type { DayStatus, Targets, WeekSummary } from '../types'

export function toISODate(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export function weekMonday(d: Date): Date {
  return startOfWeek(d, { weekStartsOn: 1 })
}

export function isWorkDay(d: Date, workDays: number[]): boolean {
  return workDays.includes(getDay(d))
}

export function dayStatus(hours: number | undefined, targets: Targets): DayStatus {
  if (hours === undefined || Number.isNaN(hours)) return 'empty'
  if (hours < targets.dayMin) return 'under'
  if (hours > targets.dayMax) return 'over'
  return 'ok'
}

export function weekStatus(total: number, targets: Targets): DayStatus {
  if (total === 0) return 'empty'
  if (total < targets.weekMin) return 'under'
  if (total > targets.weekMax) return 'over'
  return 'ok'
}

export function weekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export function sumWeek(
  weekStart: Date,
  entries: Record<string, number>,
): number {
  return weekDays(weekStart).reduce((sum, d) => {
    const h = entries[toISODate(d)]
    return sum + (typeof h === 'number' ? h : 0)
  }, 0)
}

export function weekTargetMid(targets: Targets): number {
  return (targets.weekMin + targets.weekMax) / 2
}

/**
 * Calcule combien d'heures il faut encore faire pour rentrer « dans les clous ».
 * Retourne la fourchette restante pour la semaine et la suggestion par jour restant.
 */
export function clousAdvice(
  weekStart: Date,
  today: Date,
  entries: Record<string, number>,
  targets: Targets,
): {
  done: number
  remainingMin: number
  remainingMax: number
  remainingWorkDays: number
  perDayMin: number | null
  perDayMax: number | null
  perDayIdeal: number | null
  weekStatus: DayStatus
  message: string
} {
  const days = weekDays(weekStart)
  const done = sumWeek(weekStart, entries)
  const status = weekStatus(done, targets)

  // Jours travaillés restants : futurs, ou aujourd'hui si pas encore saisi
  const workDaysLeft = days.filter(
    (d) =>
      isWorkDay(d, targets.workDays) &&
      (isAfter(d, today) || (isSameDay(d, today) && (entries[toISODate(d)] ?? 0) === 0)),
  ).length

  const remainingMin = Math.max(0, targets.weekMin - done)
  const remainingMax = Math.max(0, targets.weekMax - done)

  let perDayMin: number | null = null
  let perDayMax: number | null = null
  let perDayIdeal: number | null = null

  if (workDaysLeft > 0) {
    perDayMin = Math.round((remainingMin / workDaysLeft) * 100) / 100
    perDayMax = Math.round((remainingMax / workDaysLeft) * 100) / 100
    const idealTotal = weekTargetMid(targets)
    perDayIdeal =
      Math.round(((idealTotal - done) / workDaysLeft) * 100) / 100
  }

  let message: string
  if (status === 'ok' && workDaysLeft === 0) {
    message = 'Semaine dans les clous. Bravo.'
  } else if (status === 'over') {
    const excess = Math.round((done - targets.weekMax) * 100) / 100
    message = `Dépassement de ${formatHours(excess)} au-dessus du max hebdo.`
  } else if (status === 'under' && workDaysLeft === 0) {
    const short = Math.round((targets.weekMin - done) * 100) / 100
    message = `Manque ${formatHours(short)} pour atteindre le minimum hebdo.`
  } else if (workDaysLeft > 0 && perDayIdeal !== null) {
    if (perDayIdeal <= 0) {
      message = 'Objectif déjà atteint — tu peux faire le minimum les jours restants.'
    } else if (perDayIdeal > targets.dayMax) {
      message = `Il faudrait ~${formatHours(perDayIdeal)}/j restant (au-dessus du max jour).`
    } else if (perDayIdeal < targets.dayMin) {
      message = `Il suffit de ~${formatHours(Math.max(perDayIdeal, 0))}/j restant pour viser le milieu de fourchette.`
    } else {
      message = `Vise ~${formatHours(perDayIdeal)}/j les ${workDaysLeft} jour${workDaysLeft > 1 ? 's' : ''} restant${workDaysLeft > 1 ? 's' : ''} pour rentrer parfaitement dans les clous.`
    }
  } else {
    message = 'Saisis tes heures pour obtenir une recommandation.'
  }

  return {
    done,
    remainingMin,
    remainingMax,
    remainingWorkDays: workDaysLeft,
    perDayMin,
    perDayMax,
    perDayIdeal,
    weekStatus: status,
    message,
  }
}

export function formatHours(h: number): string {
  const rounded = Math.round(h * 100) / 100
  const whole = Math.trunc(rounded)
  const frac = Math.round((Math.abs(rounded) - Math.abs(whole)) * 100) / 100
  if (frac === 0) return `${whole} h`
  if (frac === 0.5) return `${whole} h 30`
  const minutes = Math.round(frac * 60)
  return `${whole} h ${String(minutes).padStart(2, '0')}`
}

export function formatBalance(balance: number): string {
  if (balance === 0) return '±0 h'
  const sign = balance > 0 ? '+' : '−'
  return `${sign}${formatHours(Math.abs(balance))}`
}

export function buildHistory(
  entries: Record<string, number>,
  targets: Targets,
  reference: Date = new Date(),
  weeksBack = 12,
): WeekSummary[] {
  const currentMonday = weekMonday(reference)
  const summaries: WeekSummary[] = []

  // Inclure aussi les semaines passées qui ont des entrées, au-delà de weeksBack
  const entryDates = Object.keys(entries)
    .filter((k) => entries[k] > 0)
    .map((k) => parseISO(k))
    .sort((a, b) => a.getTime() - b.getTime())

  let oldestMonday = addWeeks(currentMonday, -(weeksBack - 1))
  if (entryDates.length > 0) {
    const firstMonday = weekMonday(entryDates[0])
    if (isBefore(firstMonday, oldestMonday)) oldestMonday = firstMonday
  }

  let cursor = oldestMonday
  while (!isAfter(cursor, currentMonday)) {
    // Ne pas inclure la semaine en cours dans l'historique (affichée à part)
    if (!isSameDay(cursor, currentMonday)) {
      const total = sumWeek(cursor, entries)
      if (total > 0 || !isBefore(cursor, addWeeks(currentMonday, -(weeksBack - 1)))) {
        const mid = weekTargetMid(targets)
        const balance = Math.round((total - mid) * 100) / 100
        summaries.push({
          weekStart: toISODate(cursor),
          label: `Sem. ${format(cursor, 'd MMM', { locale: fr })} – ${format(addDays(cursor, 6), 'd MMM yyyy', { locale: fr })}`,
          total,
          targetMid: mid,
          balance,
          status: weekStatus(total, targets),
        })
      }
    }
    cursor = addWeeks(cursor, 1)
  }

  return summaries.reverse()
}

export function dayLabel(d: Date): string {
  return format(d, 'EEE d', { locale: fr })
}

export function monthTitle(d: Date): string {
  return format(d, 'MMMM yyyy', { locale: fr })
}
