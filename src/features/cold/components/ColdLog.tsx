import type { ColdSession } from '../types/cold'
import './ColdLog.css'

interface Props {
  sessions: ColdSession[]
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getDateLabel(iso: string): string {
  const sessionDay = iso.slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (sessionDay === today) return 'Today'
  if (sessionDay === yesterday) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

interface Group {
  label: string
  sessions: ColdSession[]
}

function groupByDay(sessions: ColdSession[]): Group[] {
  const map = new Map<string, Group>()
  for (const s of sessions) {
    const label = getDateLabel(s.date)
    if (!map.has(label)) map.set(label, { label, sessions: [] })
    map.get(label)!.sessions.push(s)
  }
  return Array.from(map.values())
}

export function ColdLog({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="cold-log cold-log--empty">
        <span className="cold-log__empty-text">No sessions yet</span>
      </div>
    )
  }

  const groups = groupByDay(sessions.slice(0, 20))

  return (
    <div className="cold-log">
      <span className="cold-log__heading">Sessions</span>
      <div className="cold-log__groups">
        {groups.map(group => (
          <div key={group.label} className="cold-log__group">
            <span className="cold-log__date">{group.label}</span>
            <div className="cold-log__items">
              {group.sessions.map(s => (
                <div key={s.id} className="cold-log__item">
                  <span className="cold-log__duration">{formatDuration(s.duration)}</span>
                  <span className="cold-log__time">{formatTime(s.date)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
