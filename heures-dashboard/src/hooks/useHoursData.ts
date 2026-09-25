import { useEffect, useState } from 'react'
import type { AppData, Targets } from '../types'
import { loadData, saveData } from '../lib/storage'

export function useHoursData() {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  function setHours(date: string, hours: number | null) {
    setData((prev) => {
      const entries = { ...prev.entries }
      if (hours === null || Number.isNaN(hours) || hours < 0) {
        delete entries[date]
      } else {
        entries[date] = Math.round(hours * 100) / 100
      }
      return { ...prev, entries }
    })
  }

  function setTargets(targets: Targets) {
    setData((prev) => ({ ...prev, targets }))
  }

  return { data, setHours, setTargets }
}
