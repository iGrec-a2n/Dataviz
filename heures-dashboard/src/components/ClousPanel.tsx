import type { Targets } from '../types'
import { clousAdvice, formatHours } from '../lib/hours'

interface Props {
  weekStart: Date
  today: Date
  entries: Record<string, number>
  targets: Targets
}

export function ClousPanel({ weekStart, today, entries, targets }: Props) {
  const advice = clousAdvice(weekStart, today, entries, targets)

  return (
    <section
      className={`panel clous-panel status-${advice.weekStatus}`}
      aria-labelledby="clous-title"
    >
      <header className="panel-header">
        <h2 id="clous-title">Dans les clous</h2>
        <p>{advice.message}</p>
      </header>

      <div className="clous-stats">
        <div className="clous-stat">
          <span className="clous-stat-label">Fait</span>
          <strong>{formatHours(advice.done)}</strong>
        </div>
        <div className="clous-stat">
          <span className="clous-stat-label">Reste (min→max)</span>
          <strong>
            {formatHours(advice.remainingMin)} → {formatHours(advice.remainingMax)}
          </strong>
        </div>
        <div className="clous-stat highlight">
          <span className="clous-stat-label">Idéal / jour restant</span>
          <strong>
            {advice.perDayIdeal === null
              ? '—'
              : advice.perDayIdeal <= 0
                ? '0 h'
                : formatHours(advice.perDayIdeal)}
          </strong>
          {advice.remainingWorkDays > 0 && (
            <span className="clous-stat-sub">
              sur {advice.remainingWorkDays} jour
              {advice.remainingWorkDays > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {advice.perDayMin !== null && advice.perDayMax !== null && (
        <p className="clous-range">
          Pour rester entre {targets.weekMin} et {targets.weekMax} h :{' '}
          <strong>
            {formatHours(Math.max(0, advice.perDayMin))} –{' '}
            {formatHours(Math.max(0, advice.perDayMax))}
          </strong>{' '}
          par jour restant.
        </p>
      )}
    </section>
  )
}
