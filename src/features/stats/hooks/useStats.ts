import { useMemo } from 'react'
import type { BreathingSession } from '@/features/breathing/types/breathing'
import type { ColdSession } from '@/features/cold/types/cold'

export type Period = 'week' | 'month' | '3months'

export interface DayActivity {
  date: string  // YYYY-MM-DD
  breathing: number
  cold: number
  total: number
}

export interface ChartPoint {
  date: string
  value: number    // seconds
  label: string    // for tooltip
}

export interface Stats {
  breathingThisMonth: number
  breathingLastMonth: number
  bestHoldThisMonth: number
  bestHoldLastMonth: number
  coldThisMonth: number
  coldLastMonth: number
  coldStreak: number
  activityGrid: DayActivity[]
  breathingChart: ChartPoint[]
  coldChart: ChartPoint[]
}

// ── loaders ──────────────────────────────────────────────

function loadBreathing(): BreathingSession[] {
  try { return JSON.parse(localStorage.getItem('hl_breathing_sessions') ?? '[]') } catch { return [] }
}

function loadCold(): ColdSession[] {
  try { return JSON.parse(localStorage.getItem('hl_cold_sessions') ?? '[]') } catch { return [] }
}

// ── helpers ───────────────────────────────────────────────

function isoMonth(iso: string) { return iso.slice(0, 7) }
function isoDay(iso: string)   { return iso.slice(0, 10) }

function prevMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return m === 1
    ? `${y - 1}-12`
    : `${y}-${String(m - 1).padStart(2, '0')}`
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function coldStreak(sessions: ColdSession[]): number {
  const days = new Set(sessions.map(s => isoDay(s.date)))
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  let streak = 0
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function cutoffDay(period: Period): string {
  if (period === 'week')    return daysAgo(7)
  if (period === 'month')   return daysAgo(30)
  return daysAgo(90)
}

// ── main hook ─────────────────────────────────────────────

export function useStats(period: Period): Stats {
  return useMemo(() => {
    const breathing = loadBreathing()
    const cold      = loadCold()

    const thisMonth = isoMonth(new Date().toISOString())
    const lastMonth = prevMonth(thisMonth)

    // Metrics
    const breathingThisMonth = breathing.filter(s => isoMonth(s.date) === thisMonth).length
    const breathingLastMonth = breathing.filter(s => isoMonth(s.date) === lastMonth).length

    const holdsThis = breathing
      .filter(s => isoMonth(s.date) === thisMonth)
      .flatMap(s => s.holdTimes)
    const holdsLast = breathing
      .filter(s => isoMonth(s.date) === lastMonth)
      .flatMap(s => s.holdTimes)
    const bestHoldThisMonth = holdsThis.length ? Math.max(...holdsThis) : 0
    const bestHoldLastMonth = holdsLast.length ? Math.max(...holdsLast) : 0

    const coldThisMonth = cold.filter(s => isoMonth(s.date) === thisMonth).length
    const coldLastMonth = cold.filter(s => isoMonth(s.date) === lastMonth).length

    // Activity grid — 90 days
    const activityGrid: DayActivity[] = []
    for (let i = 89; i >= 0; i--) {
      const date = daysAgo(i)
      const b = breathing.filter(s => isoDay(s.date) === date).length
      const c = cold.filter(s => isoDay(s.date) === date).length
      activityGrid.push({ date, breathing: b, cold: c, total: b + c })
    }

    // Charts — filtered by period
    const cutoff = cutoffDay(period)

    const breathingChart: ChartPoint[] = breathing
      .filter(s => isoDay(s.date) >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(s => ({
        date: isoDay(s.date),
        value: s.holdTimes.length ? Math.max(...s.holdTimes) : 0,
        label: `Best hold: ${formatSecs(s.holdTimes.length ? Math.max(...s.holdTimes) : 0)}`,
      }))

    const coldChart: ChartPoint[] = cold
      .filter(s => isoDay(s.date) >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(s => ({
        date: isoDay(s.date),
        value: s.duration,
        label: `Duration: ${formatSecs(s.duration)}`,
      }))

    return {
      breathingThisMonth,
      breathingLastMonth,
      bestHoldThisMonth,
      bestHoldLastMonth,
      coldThisMonth,
      coldLastMonth,
      coldStreak: coldStreak(cold),
      activityGrid,
      breathingChart,
      coldChart,
    }
  }, [period])
}

export function formatSecs(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m === 0) return `${sec}s`
  return `${m}:${sec.toString().padStart(2, '0')}`
}
