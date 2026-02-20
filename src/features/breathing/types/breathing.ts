export type BreathingPhase = 'idle' | 'inhale' | 'exhale' | 'hold' | 'recovery' | 'complete'

export interface BreathingPreset {
  id: string
  name: string
  breathsPerRound: number
  rounds: number
  inhaleDuration: number  // ms
  exhaleDuration: number  // ms
  recoveryDuration: number // seconds
}

export interface BreathingSession {
  date: string
  preset: string
  rounds: number
  holdTimes: number[]  // seconds per round
  totalMinutes: number
}
