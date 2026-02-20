import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import { BackButton } from '@/shared/ui/BackButton/BackButton'
import { useBreathingSession } from './hooks/useBreathingSession'
import { BreathingCircle } from './components/BreathingCircle'
import { RoundIndicator } from './components/RoundIndicator'
import { SessionComplete } from './components/SessionComplete'
import { WIM_HOF } from './config/presets'
import './BreathingPage.css'

export function BreathingPage() {
  const navigate = useNavigate()
  const {
    phase,
    round,
    totalRounds,
    breathCount,
    breathsPerRound,
    holdSeconds,
    recoverySeconds,
    holdTimes,
    start,
    endHold,
    reset,
  } = useBreathingSession(WIM_HOF)

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        if (phase === 'hold') endHold()
        if (phase === 'idle') start()
      }
      if (e.code === 'Enter' && phase === 'idle') {
        start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, endHold, start])

  function handleBack() {
    reset()
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="breathing-page">
        <div className="breathing-page__top">
          <BackButton />
          <RoundIndicator current={round} total={totalRounds} phase={phase} />
          <div className="breathing-page__top-end">
            <span className="breathing-page__preset-label">{WIM_HOF.name}</span>
          </div>
        </div>

        <div className="breathing-page__body">
          {phase === 'complete' ? (
            <SessionComplete
              holdTimes={holdTimes}
              onRestart={start}
              onBack={handleBack}
            />
          ) : (
            <>
              <BreathingCircle
                phase={phase}
                breathCount={breathCount}
                breathsPerRound={breathsPerRound}
                holdSeconds={holdSeconds}
                recoverySeconds={recoverySeconds}
                onClick={endHold}
              />

              <div className="breathing-page__bottom">
                {phase === 'idle' && (
                  <button className="breathing-page__start-btn" onClick={start}>
                    Start
                  </button>
                )}
                {phase === 'hold' && (
                  <span className="breathing-page__hint">
                    tap · space to release
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
