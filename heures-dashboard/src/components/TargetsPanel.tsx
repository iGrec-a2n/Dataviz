import { useId } from 'react'
import type { Targets } from '../types'

const DAY_OPTIONS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
  { value: 0, label: 'Dim' },
]

interface Props {
  targets: Targets
  onChange: (t: Targets) => void
}

export function TargetsPanel({ targets, onChange }: Props) {
  const id = useId()

  function num(field: keyof Targets, value: string) {
    const n = Number(value)
    if (Number.isNaN(n) || n < 0) return
    onChange({ ...targets, [field]: n })
  }

  function toggleDay(day: number) {
    const has = targets.workDays.includes(day)
    const workDays = has
      ? targets.workDays.filter((d) => d !== day)
      : [...targets.workDays, day].sort((a, b) => {
          // lun→dim order
          const order = (x: number) => (x === 0 ? 7 : x)
          return order(a) - order(b)
        })
    if (workDays.length === 0) return
    onChange({ ...targets, workDays })
  }

  return (
    <section className="panel targets-panel" aria-labelledby={`${id}-title`}>
      <header className="panel-header">
        <h2 id={`${id}-title`}>Objectifs</h2>
        <p>Min / max pour rester dans les clous.</p>
      </header>

      <div className="targets-grid">
        <fieldset>
          <legend>Par jour</legend>
          <label>
            Min
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={targets.dayMin}
              onChange={(e) => num('dayMin', e.target.value)}
            />
          </label>
          <label>
            Max
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={targets.dayMax}
              onChange={(e) => num('dayMax', e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Par semaine</legend>
          <label>
            Min
            <input
              type="number"
              min={0}
              max={168}
              step={0.5}
              value={targets.weekMin}
              onChange={(e) => num('weekMin', e.target.value)}
            />
          </label>
          <label>
            Max
            <input
              type="number"
              min={0}
              max={168}
              step={0.5}
              value={targets.weekMax}
              onChange={(e) => num('weekMax', e.target.value)}
            />
          </label>
        </fieldset>
      </div>

      <div className="workdays">
        <span className="workdays-label">Jours travaillés</span>
        <div className="workdays-row" role="group" aria-label="Jours travaillés">
          {DAY_OPTIONS.map((d) => {
            const active = targets.workDays.includes(d.value)
            return (
              <button
                key={d.value}
                type="button"
                className={`day-chip${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleDay(d.value)}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
