import type { WeekSummary } from '../types'
import { formatBalance, formatHours } from '../lib/hours'

interface Props {
  weeks: WeekSummary[]
  weekMin: number
  weekMax: number
}

export function HistoryPanel({ weeks, weekMin, weekMax }: Props) {
  return (
    <section className="panel history-panel" aria-labelledby="history-title">
      <header className="panel-header">
        <h2 id="history-title">Historique</h2>
        <p>
          Balance hebdo vs milieu de fourchette ({weekMin}–{weekMax} h).
        </p>
      </header>

      {weeks.length === 0 ? (
        <p className="empty-state">Aucune semaine précédente pour l’instant.</p>
      ) : (
        <ul className="history-list">
          {weeks.map((w) => (
            <li key={w.weekStart} className={`history-row status-${w.status}`}>
              <div className="history-label">
                <span className="history-week">{w.label}</span>
                <span className="history-total">{formatHours(w.total)}</span>
              </div>
              <div
                className={`history-balance ${w.balance > 0 ? 'pos' : w.balance < 0 ? 'neg' : 'zero'}`}
              >
                {formatBalance(w.balance)}
              </div>
              <div className="history-bar" aria-hidden>
                <div
                  className="history-bar-fill"
                  style={{
                    width: `${Math.min(100, (w.total / Math.max(weekMax, 1)) * 100)}%`,
                  }}
                />
                <div
                  className="history-bar-zone"
                  style={{
                    left: `${(weekMin / Math.max(weekMax, 1)) * 100}%`,
                    width: `${((weekMax - weekMin) / Math.max(weekMax, 1)) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
