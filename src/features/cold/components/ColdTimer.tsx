import { useLanguage } from '@/shared/i18n/LanguageContext'
import './ColdTimer.css'

interface Props {
  elapsed: number   // seconds
  isRunning: boolean
  onStart: () => void
  onStop: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function ColdTimer({ elapsed, isRunning, onStart, onStop }: Props) {
  const { t } = useLanguage()

  return (
    <div className="cold-timer">
      <div className="cold-timer__circle" data-running={isRunning}>
        <div className="cold-timer__ring cold-timer__ring--outer" />
        <div className="cold-timer__ring cold-timer__ring--inner" />
        <div className="cold-timer__face">
          <span className="cold-timer__time">{formatTime(elapsed)}</span>
          {!isRunning && elapsed === 0 && (
            <span className="cold-timer__hint">{t('coldExposureTitle')}</span>
          )}
        </div>
      </div>

      <button
        className={`cold-timer__btn ${isRunning ? 'cold-timer__btn--stop' : ''}`}
        onClick={isRunning ? onStop : onStart}
      >
        {isRunning ? t('stop') : t('start')}
      </button>
    </div>
  )
}
