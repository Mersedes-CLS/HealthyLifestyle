import type { BreathingPreset } from '../types/breathing'

export const WIM_HOF: BreathingPreset = {
  id: 'wim-hof',
  name: 'Wim Hof',
  breathsPerRound: 30,
  rounds: 3,
  inhaleDuration: 1500,
  exhaleDuration: 1500,
  recoveryDuration: 15,
}

export const PRESETS: BreathingPreset[] = [WIM_HOF]
