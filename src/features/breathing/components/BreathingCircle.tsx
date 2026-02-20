import type { BreathingPhase } from '../types/breathing'
import './BreathingCircle.css'

interface Props {
  phase: BreathingPhase
  breathCount: number
  breathsPerRound: number
  holdSeconds: number
  recoverySeconds: number
  onClick: () => void
}

function getPhaseLabel(phase: BreathingPhase): string {
  switch (phase) {
    case 'inhale': return 'inhale'
    case 'exhale': return 'exhale'
    case 'hold': return 'hold'
    case 'recovery': return 'recovery'
    default: return ''
  }
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`
  return `${sec}s`
}

function getCounter(
  phase: BreathingPhase,
  breathCount: number,
  breathsPerRound: number,
  holdSeconds: number,
  recoverySeconds: number,
): string {
  switch (phase) {
    case 'inhale':
    case 'exhale':
      return `${breathCount} / ${breathsPerRound}`
    case 'hold':
      return formatSeconds(holdSeconds)
    case 'recovery':
      return formatSeconds(recoverySeconds)
    default:
      return ''
  }
}

export function BreathingCircle({
  phase,
  breathCount,
  breathsPerRound,
  holdSeconds,
  recoverySeconds,
  onClick,
}: Props) {
  const label = getPhaseLabel(phase)
  const counter = getCounter(phase, breathCount, breathsPerRound, holdSeconds, recoverySeconds)

  return (
    <div
      className="breathing-circle"
      data-phase={phase}
      onClick={phase === 'hold' ? onClick : undefined}
      style={{ cursor: phase === 'hold' ? 'pointer' : 'default' }}
    >
      <div className="breathing-circle__ring breathing-circle__ring--outer" />
      <div className="breathing-circle__ring breathing-circle__ring--mid" />
      <div className="breathing-circle__core">
        {label && <span className="breathing-circle__label">{label}</span>}
        {counter && <span className="breathing-circle__counter">{counter}</span>}
      </div>
    </div>
  )
}
