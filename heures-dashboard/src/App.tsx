import { useMemo, useState } from 'react'
import { addWeeks, isSameDay } from 'date-fns'
import { ClousPanel } from './components/ClousPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { TargetsPanel } from './components/TargetsPanel'
import { WeekBoard } from './components/WeekBoard'
import { useHoursData } from './hooks/useHoursData'
import { buildHistory, weekMonday } from './lib/hours'
import './App.css'

export default function App() {
  const today = useMemo(() => new Date(), [])
  const { data, setHours, setTargets } = useHoursData()
  const [weekOffset, setWeekOffset] = useState(0)

  const currentMonday = weekMonday(today)
  const weekStart = addWeeks(currentMonday, weekOffset)
  const isCurrentWeek = isSameDay(weekStart, currentMonday)

  const history = useMemo(
    () => buildHistory(data.entries, data.targets, today, 12),
    [data.entries, data.targets, today],
  )

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden />

      <header className="hero">
        <p className="brand">Heures</p>
        <h1>Compte tes heures. Reste dans les clous.</h1>
        <p className="lede">
          Saisie quotidienne, objectifs min/max jour et semaine, recommandation
          pour finir pile dans la fourchette — et un historique de balances
          hebdomadaires.
        </p>
      </header>

      <main className="layout">
        <div className="col-main">
          <WeekBoard
            weekStart={weekStart}
            today={today}
            entries={data.entries}
            targets={data.targets}
            onChangeHours={setHours}
            onPrevWeek={() => setWeekOffset((o) => o - 1)}
            onNextWeek={() => setWeekOffset((o) => o + 1)}
            onToday={() => setWeekOffset(0)}
            isCurrentWeek={isCurrentWeek}
          />
          <HistoryPanel
            weeks={history}
            weekMin={data.targets.weekMin}
            weekMax={data.targets.weekMax}
          />
        </div>

        <aside className="col-side">
          <ClousPanel
            weekStart={weekStart}
            today={today}
            entries={data.entries}
            targets={data.targets}
          />
          <TargetsPanel targets={data.targets} onChange={setTargets} />
        </aside>
      </main>

      <footer className="footer">
        <span>Données stockées localement dans ton navigateur.</span>
      </footer>
    </div>
  )
}
