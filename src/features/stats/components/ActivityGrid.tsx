import { useState } from 'react'
import type { DayActivity } from '../hooks/useStats'
import './ActivityGrid.css'

interface Props {
  days: DayActivity[]
}

interface TooltipState {
  day: DayActivity
  x: number
  y: number
}

function intensity(total: number): number {
  if (total === 0) return 0
  if (total === 1) return 1
  if (total === 2) return 2
  return 3
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function buildTooltipText(day: DayActivity): string {
  const parts: string[] = []
  if (day.breathing > 0) parts.push(`Breathing ×${day.breathing}`)
  if (day.cold > 0)      parts.push(`Cold ×${day.cold}`)
  if (parts.length === 0) return 'No activity'
  return parts.join(' · ')
}

// Number of empty filler cells needed before the first day
// so the grid aligns to Monday (column start)
function fillerCount(firstDate: string): number {
  const dow = new Date(firstDate + 'T00:00:00').getDay() // 0=Sun
  return (dow + 6) % 7 // 0=Mon→0, 1=Tue→1, ... 6=Sun→6
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Build week-column month label positions
function buildMonthLabels(days: DayActivity[], fillers: number): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = []
  let lastMonth = -1
  days.forEach((day, i) => {
    const month = new Date(day.date + 'T00:00:00').getMonth()
    if (month !== lastMonth) {
      const col = Math.floor((i + fillers) / 7) + 1
      labels.push({ label: MONTH_LABELS[month], col })
      lastMonth = month
    }
  })
  return labels
}

export function ActivityGrid({ days }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  if (days.length === 0) return null

  const fillers = fillerCount(days[0].date)
  const monthLabels = buildMonthLabels(days, fillers)
  const totalCols = Math.ceil((days.length + fillers) / 7)

  return (
    <div className="activity-grid">
      {/* Month labels */}
      <div className="activity-grid__months" style={{ gridTemplateColumns: `repeat(${totalCols}, 13px)` }}>
        {monthLabels.map(({ label, col }) => (
          <span
            key={label + col}
            className="activity-grid__month-label"
            style={{ gridColumnStart: col }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="activity-grid__wrap">
        {/* Day-of-week labels */}
        <div className="activity-grid__dow">
          {['M','W','F'].map(d => (
            <span key={d} className="activity-grid__dow-label">{d}</span>
          ))}
        </div>

        {/* Cells */}
        <div className="activity-grid__cells">
          {Array.from({ length: fillers }, (_, i) => (
            <div key={`f-${i}`} className="activity-cell activity-cell--empty" />
          ))}
          {days.map(day => (
            <div
              key={day.date}
              className={`activity-cell activity-cell--${intensity(day.total)}`}
              onMouseEnter={e => {
                const rect = (e.target as HTMLElement).getBoundingClientRect()
                const parent = (e.target as HTMLElement).closest('.activity-grid')!.getBoundingClientRect()
                setTooltip({ day, x: rect.left - parent.left + rect.width / 2, y: rect.top - parent.top })
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="activity-grid__tooltip"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <span className="activity-grid__tooltip-date">{formatDate(tooltip.day.date)}</span>
          <span className="activity-grid__tooltip-text">{buildTooltipText(tooltip.day)}</span>
        </div>
      )}
    </div>
  )
}
