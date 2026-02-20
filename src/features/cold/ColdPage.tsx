import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import { BackButton } from '@/shared/ui/BackButton/BackButton'
import { useColdTracker } from './hooks/useColdTracker'
import { ColdTimer } from './components/ColdTimer'
import { ColdLog } from './components/ColdLog'
import { StreakDisplay } from './components/StreakDisplay'
import './ColdPage.css'

export function ColdPage() {
  const { isRunning, elapsed, sessions, streak, start, stop } = useColdTracker()

  return (
    <PageTransition>
      <div className="cold-page">
        <div className="cold-page__top">
          <BackButton />
          <StreakDisplay streak={streak} />
        </div>

        <div className="cold-page__body">
          <ColdTimer
            elapsed={elapsed}
            isRunning={isRunning}
            onStart={start}
            onStop={stop}
          />

          <div className="cold-page__divider" />

          <ColdLog sessions={sessions} />
        </div>
      </div>
    </PageTransition>
  )
}
