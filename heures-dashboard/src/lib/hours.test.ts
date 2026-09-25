import { describe, expect, it } from 'vitest'
import { addDays, startOfWeek } from 'date-fns'
import {
  buildHistory,
  clousAdvice,
  dayStatus,
  formatBalance,
  formatHours,
  sumWeek,
  toISODate,
  weekStatus,
} from './hours'
import type { Targets } from '../types'

const targets: Targets = {
  dayMin: 7,
  dayMax: 8,
  weekMin: 35,
  weekMax: 39,
  workDays: [1, 2, 3, 4, 5],
}

describe('dayStatus / weekStatus', () => {
  it('classifie les heures jour', () => {
    expect(dayStatus(undefined, targets)).toBe('empty')
    expect(dayStatus(6, targets)).toBe('under')
    expect(dayStatus(7.5, targets)).toBe('ok')
    expect(dayStatus(9, targets)).toBe('over')
  })

  it('classifie le total semaine', () => {
    expect(weekStatus(0, targets)).toBe('empty')
    expect(weekStatus(30, targets)).toBe('under')
    expect(weekStatus(37, targets)).toBe('ok')
    expect(weekStatus(42, targets)).toBe('over')
  })
})

describe('formatHours', () => {
  it('formate heures et demi', () => {
    expect(formatHours(7)).toBe('7 h')
    expect(formatHours(7.5)).toBe('7 h 30')
    expect(formatHours(7.25)).toBe('7 h 15')
  })

  it('formate la balance', () => {
    expect(formatBalance(0)).toBe('±0 h')
    expect(formatBalance(2)).toBe('+2 h')
    expect(formatBalance(-1.5)).toBe('−1 h 30')
  })
})

describe('clousAdvice', () => {
  it('calcule l’idéal pour rentrer dans les clous', () => {
    // Lundi 2026-03-02
    const monday = startOfWeek(new Date(2026, 2, 2), { weekStartsOn: 1 })
    const tuesday = addDays(monday, 1)
    const entries: Record<string, number> = {
      [toISODate(monday)]: 8,
      [toISODate(tuesday)]: 8,
    }
    // Mercredi = aujourd'hui → 3 jours restants (mer, jeu, ven) si mercredi non saisi
    const wednesday = addDays(monday, 2)
    const advice = clousAdvice(monday, wednesday, entries, targets)

    expect(advice.done).toBe(16)
    expect(advice.remainingWorkDays).toBe(3)
    // mid = 37 → reste 21 / 3 = 7
    expect(advice.perDayIdeal).toBe(7)
    expect(advice.remainingMin).toBe(19)
    expect(advice.remainingMax).toBe(23)
  })
})

describe('sumWeek / history', () => {
  it('somme une semaine', () => {
    const monday = startOfWeek(new Date(2026, 2, 2), { weekStartsOn: 1 })
    const entries: Record<string, number> = {}
    for (let i = 0; i < 5; i++) {
      entries[toISODate(addDays(monday, i))] = 7.5
    }
    expect(sumWeek(monday, entries)).toBe(37.5)
  })

  it('construit un historique avec balance', () => {
    const thisMonday = startOfWeek(new Date(2026, 2, 16), { weekStartsOn: 1 })
    const prevMonday = addDays(thisMonday, -7)
    const entries: Record<string, number> = {}
    for (let i = 0; i < 5; i++) {
      entries[toISODate(addDays(prevMonday, i))] = 8
    }
    const history = buildHistory(entries, targets, addDays(thisMonday, 2), 4)
    expect(history.length).toBeGreaterThan(0)
    const prev = history.find((w) => w.weekStart === toISODate(prevMonday))
    expect(prev).toBeDefined()
    expect(prev!.total).toBe(40)
    // mid = 37 → balance +3
    expect(prev!.balance).toBe(3)
    expect(prev!.status).toBe('over')
  })
})
