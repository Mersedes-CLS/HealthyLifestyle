import type { BreathingPhase } from '../types/breathing'
import './BreathingCircle.css'

interface Props {
  phase: BreathingPhase
  breathCount: number
  breathsPerRound: number
  holdSeconds: number
  recoverySeconds: number
  onClick: () => void
  onStart?: () => void
  startLabel?: string
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
  onStart,
  startLabel,
}: Props) {
  const label = getPhaseLabel(phase)
  const counter = getCounter(phase, breathCount, breathsPerRound, holdSeconds, recoverySeconds)

  function handleClick() {
    if (phase === 'idle' && onStart) onStart()
    else if (phase === 'hold') onClick()
  }

  return (
    <div
      className="breathing-orb"
      data-phase={phase}
      onClick={phase === 'hold' || phase === 'idle' ? handleClick : undefined}
      style={{ cursor: phase === 'hold' || phase === 'idle' ? 'pointer' : 'default' }}
    >
      <div className="breathing-orb__halo" />
      <div className="breathing-orb__glow--outer" />
      <div className="breathing-orb__glow--inner" />
      <div className="breathing-orb__core">
        {phase === 'idle' ? (
          <button className="breathing-orb__start" onClick={onStart} type="button">
            {startLabel ?? 'start'}
          </button>
        ) : (
          <>
            {label && <span className="breathing-orb__label">{label}</span>}
            {counter && <span className="breathing-orb__counter">{counter}</span>}
          </>
        )}
      </div>
    </div>
  )
}
