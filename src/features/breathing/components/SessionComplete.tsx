import './SessionComplete.css'

interface Props {
  holdTimes: number[]
  onRestart: () => void
  onBack: () => void
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`
  return `${sec}s`
}

export function SessionComplete({ holdTimes, onRestart, onBack }: Props) {
  const best = holdTimes.length > 0 ? Math.max(...holdTimes) : 0
  const avg = holdTimes.length > 0
    ? Math.round(holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length)
    : 0

  return (
    <div className="session-complete">
      <div className="session-complete__header">
        <span className="session-complete__tag">session complete</span>
        <h2 className="session-complete__title">Well done</h2>
      </div>

      <div className="session-complete__rounds">
        {holdTimes.map((t, i) => (
          <div key={i} className="session-complete__round">
            <span className="session-complete__round-label">Round {i + 1}</span>
            <span className="session-complete__round-time">{formatSeconds(t)}</span>
          </div>
        ))}
      </div>

      <div className="session-complete__stats">
        <div className="session-complete__stat">
          <span className="session-complete__stat-value">{formatSeconds(best)}</span>
          <span className="session-complete__stat-label">best hold</span>
        </div>
        <div className="session-complete__stat">
          <span className="session-complete__stat-value">{formatSeconds(avg)}</span>
          <span className="session-complete__stat-label">avg hold</span>
        </div>
      </div>

      <div className="session-complete__actions">
        <button className="session-complete__btn session-complete__btn--primary" onClick={onRestart}>
          Again
        </button>
        <button className="session-complete__btn" onClick={onBack}>
          Dashboard
        </button>
      </div>
    </div>
  )
}
