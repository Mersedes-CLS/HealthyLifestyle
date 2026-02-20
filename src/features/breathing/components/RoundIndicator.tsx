import type { BreathingPhase } from '../types/breathing'
import './RoundIndicator.css'

interface Props {
  current: number  // 1-indexed
  total: number
  phase: BreathingPhase
}

export function RoundIndicator({ current, total, phase }: Props) {
  if (phase === 'idle') return <div className="round-indicator round-indicator--hidden" />

  return (
    <div className="round-indicator">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const isDone = n < current
        const isActive = n === current
        return (
          <div
            key={i}
            className={`round-dot ${isDone ? 'round-dot--done' : ''} ${isActive ? 'round-dot--active' : ''}`}
          />
        )
      })}
    </div>
  )
}
