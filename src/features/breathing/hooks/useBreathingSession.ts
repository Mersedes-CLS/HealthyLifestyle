import { useState, useEffect, useRef, useCallback } from 'react'
import type { BreathingPhase, BreathingPreset, BreathingSession } from '../types/breathing'

interface SessionState {
  phase: BreathingPhase
  round: number
  breathCount: number
  holdSeconds: number
  recoverySeconds: number
  holdTimes: number[]
  startTime: number | null
}

const INITIAL: SessionState = {
  phase: 'idle',
  round: 1,
  breathCount: 1,
  holdSeconds: 0,
  recoverySeconds: 0,
  holdTimes: [],
  startTime: null,
}

export function useBreathingSession(preset: BreathingPreset) {
  const [state, setState] = useState<SessionState>(INITIAL)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAll = useCallback(() => {
    if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null }
    if (intervalRef.current !== null) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  // Drive phase transitions from state.phase changes
  useEffect(() => {
    clearAll()

    if (state.phase === 'inhale') {
      timerRef.current = setTimeout(() => {
        setState(s => ({ ...s, phase: 'exhale' }))
      }, preset.inhaleDuration)
    }

    if (state.phase === 'exhale') {
      timerRef.current = setTimeout(() => {
        setState(s => {
          if (s.breathCount < preset.breathsPerRound) {
            return { ...s, phase: 'inhale', breathCount: s.breathCount + 1 }
          }
          return { ...s, phase: 'hold', holdSeconds: 0 }
        })
      }, preset.exhaleDuration)
    }

    if (state.phase === 'hold') {
      intervalRef.current = setInterval(() => {
        setState(s => ({ ...s, holdSeconds: s.holdSeconds + 1 }))
      }, 1000)
    }

    if (state.phase === 'recovery') {
      intervalRef.current = setInterval(() => {
        setState(s => {
          if (s.recoverySeconds <= 1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            const nextRound = s.round + 1
            if (nextRound <= preset.rounds) {
              return { ...s, phase: 'inhale', round: nextRound, breathCount: 1, recoverySeconds: 0 }
            }
            persistSession(preset, s.holdTimes, s.startTime)
            return { ...s, phase: 'complete', recoverySeconds: 0 }
          }
          return { ...s, recoverySeconds: s.recoverySeconds - 1 }
        })
      }, 1000)
    }

    return clearAll
  }, [state.phase, clearAll, preset])

  const start = useCallback(() => {
    clearAll()
    setState({ ...INITIAL, phase: 'inhale', startTime: Date.now() })
  }, [clearAll])

  const endHold = useCallback(() => {
    setState(s => {
      if (s.phase !== 'hold') return s
      return {
        ...s,
        phase: 'recovery',
        holdTimes: [...s.holdTimes, s.holdSeconds],
        recoverySeconds: preset.recoveryDuration,
      }
    })
  }, [preset.recoveryDuration])

  const reset = useCallback(() => {
    clearAll()
    setState(INITIAL)
  }, [clearAll])

  return {
    phase: state.phase,
    round: state.round,
    totalRounds: preset.rounds,
    breathCount: state.breathCount,
    breathsPerRound: preset.breathsPerRound,
    holdSeconds: state.holdSeconds,
    recoverySeconds: state.recoverySeconds,
    holdTimes: state.holdTimes,
    start,
    endHold,
    reset,
  }
}

function persistSession(
  preset: BreathingPreset,
  holdTimes: number[],
  startTime: number | null,
) {
  if (!startTime) return
  const session: BreathingSession = {
    date: new Date().toISOString(),
    preset: preset.id,
    rounds: holdTimes.length,
    holdTimes,
    totalMinutes: Math.round((Date.now() - startTime) / 60000),
  }
  try {
    const key = 'hl_breathing_sessions'
    const existing: BreathingSession[] = JSON.parse(localStorage.getItem(key) ?? '[]')
    existing.push(session)
    localStorage.setItem(key, JSON.stringify(existing))
  } catch {
    // ignore storage errors
  }
}
