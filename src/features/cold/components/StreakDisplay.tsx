import './StreakDisplay.css'

interface Props {
  streak: number
}

export function StreakDisplay({ streak }: Props) {
  return (
    <div className="streak-display">
      <span className="streak-display__count">{streak}</span>
      <span className="streak-display__label">day{streak !== 1 ? 's' : ''}</span>
    </div>
  )
}
