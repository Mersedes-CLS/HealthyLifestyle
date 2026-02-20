import './MetricCard.css'

interface Props {
  value: string
  label: string
  sublabel?: string
  trend?: number      // positive = up, negative = down
  trendLabel?: string
}

export function MetricCard({ value, label, sublabel, trend, trendLabel }: Props) {
  const hasTrend = trend !== undefined
  const trendUp   = hasTrend && trend > 0
  const trendDown = hasTrend && trend < 0

  return (
    <div className="metric-card">
      <span className="metric-card__value">{value}</span>
      <span className="metric-card__label">{label}</span>
      {sublabel && <span className="metric-card__sublabel">{sublabel}</span>}
      {hasTrend && (
        <span className={`metric-card__trend ${trendUp ? 'metric-card__trend--up' : ''} ${trendDown ? 'metric-card__trend--down' : ''}`}>
          {trendUp ? '↑' : trendDown ? '↓' : '—'}
          {trend !== 0 && ` ${Math.abs(trend)}`}
          {trendLabel && <span className="metric-card__trend-label"> {trendLabel}</span>}
        </span>
      )}
    </div>
  )
}
