import { useLanguage } from '@/shared/i18n/LanguageContext'
import './StreakDisplay.css'

interface Props {
  streak: number
}

export function StreakDisplay({ streak }: Props) {
  const { t } = useLanguage()

  return (
    <div className="streak-display">
      <span className="streak-display__count">{streak}</span>
      <span className="streak-display__label">{t('days')}</span>
    </div>
  )
}
