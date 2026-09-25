import { addDays, format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Targets } from '../types'
import {
  dayLabel,
  dayStatus,
  formatHours,
  isWorkDay,
  sumWeek,
  toISODate,
  weekDays,
  weekStatus,
} from '../lib/hours'

interface Props {
  weekStart: Date
  today: Date
  entries: Record<string, number>
  targets: Targets
  onChangeHours: (date: string, hours: number | null) => void
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  isCurrentWeek: boolean
}

export function WeekBoard({
  weekStart,
  today,
  entries,
  targets,
  onChangeHours,
  onPrevWeek,
  onNextWeek,
  onToday,
  isCurrentWeek,
}: Props) {
  const days = weekDays(weekStart)
  const total = sumWeek(weekStart, entries)
  const status = weekStatus(total, targets)
  const end = addDays(weekStart, 6)

  return (
    <section className="panel week-board" aria-labelledby="week-title">
      <header className="panel-header week-header">
        <div>
          <h2 id="week-title">
            {isCurrentWeek ? 'Cette semaine' : 'Semaine'}
          </h2>
          <p>
            {format(weekStart, 'd MMM', { locale: fr })} –{' '}
            {format(end, 'd MMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="week-nav">
          <button type="button" className="nav-btn" onClick={onPrevWeek} aria-label="Semaine précédente">
            ←
          </button>
          {!isCurrentWeek && (
            <button type="button" className="nav-btn nav-today" onClick={onToday}>
              Aujourd’hui
            </button>
          )}
          <button type="button" className="nav-btn" onClick={onNextWeek} aria-label="Semaine suivante">
            →
          </button>
        </div>
      </header>

      <div className={`week-total status-${status}`}>
        <span className="week-total-label">Total</span>
        <strong className="week-total-value">{formatHours(total)}</strong>
        <span className="week-total-range">
          cible {targets.weekMin}–{targets.weekMax} h
        </span>
      </div>

      <ul className="day-list">
        {days.map((d) => {
          const iso = toISODate(d)
          const hours = entries[iso]
          const work = isWorkDay(d, targets.workDays)
          const st = work ? dayStatus(hours, targets) : 'empty'
          const isToday = isSameDay(d, today)

          return (
            <li
              key={iso}
              className={[
                'day-row',
                `status-${st}`,
                work ? 'is-work' : 'is-off',
                isToday ? 'is-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="day-meta">
                <span className="day-name">{dayLabel(d)}</span>
                {!work && <span className="day-tag">Repos</span>}
                {isToday && <span className="day-tag today-tag">aujourd’hui</span>}
              </div>
              <div className="day-input-wrap">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.25}
                  inputMode="decimal"
                  disabled={!work}
                  placeholder={work ? '0' : '—'}
                  value={hours === undefined ? '' : hours}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '') onChangeHours(iso, null)
                    else onChangeHours(iso, Number(v))
                  }}
                  aria-label={`Heures du ${format(d, 'EEEE d MMMM', { locale: fr })}`}
                />
                <span className="unit">h</span>
              </div>
              <div className="day-hint" aria-hidden={!work}>
                {work ? (
                  <>
                    {targets.dayMin}–{targets.dayMax} h
                  </>
                ) : (
                  '—'
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
