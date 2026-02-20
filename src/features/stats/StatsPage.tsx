import { useState } from 'react'
import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import { BackButton } from '@/shared/ui/BackButton/BackButton'
import { useStats, formatSecs } from './hooks/useStats'
import type { Period } from './hooks/useStats'
import { MetricCard } from './components/MetricCard'
import { ActivityGrid } from './components/ActivityGrid'
import { LineChart } from './components/LineChart'
import './StatsPage.css'

type ChartTab = 'breathing' | 'cold'

export function StatsPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [tab, setTab] = useState<ChartTab>('breathing')
  const stats = useStats(period)

  return (
    <PageTransition>
      <div className="stats-page">
        {/* Top bar */}
        <div className="stats-page__top">
          <BackButton />
          <h1 className="stats-page__title">Statistics</h1>
          <div className="stats-page__period">
            {(['week', 'month', '3months'] as Period[]).map(p => (
              <button
                key={p}
                className={`stats-page__period-btn ${period === p ? 'stats-page__period-btn--active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? '7d' : p === 'month' ? '30d' : '90d'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <section className="stats-page__section fade-up stagger-1">
          <div className="stats-page__metrics">
            <MetricCard
              value={String(stats.breathingThisMonth)}
              label="breathing"
              sublabel="this month"
              trend={stats.breathingThisMonth - stats.breathingLastMonth}
              trendLabel="vs last mo"
            />
            <MetricCard
              value={formatSecs(stats.bestHoldThisMonth)}
              label="best hold"
              sublabel="this month"
              trend={stats.bestHoldThisMonth - stats.bestHoldLastMonth}
              trendLabel="vs last mo"
            />
            <MetricCard
              value={String(stats.coldThisMonth)}
              label="cold"
              sublabel="this month"
              trend={stats.coldThisMonth - stats.coldLastMonth}
              trendLabel="vs last mo"
            />
            <MetricCard
              value={String(stats.coldStreak)}
              label="cold streak"
              sublabel="days in a row"
            />
          </div>
        </section>

        {/* Activity grid */}
        <section className="stats-page__section fade-up stagger-2">
          <span className="stats-page__section-title">Activity · last 90 days</span>
          <ActivityGrid days={stats.activityGrid} />
          <div className="stats-page__legend">
            <span className="stats-page__legend-label">less</span>
            {[0, 1, 2, 3].map(n => (
              <div key={n} className={`activity-cell activity-cell--${n}`} style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0 }} />
            ))}
            <span className="stats-page__legend-label">more</span>
          </div>
        </section>

        {/* Charts */}
        <section className="stats-page__section fade-up stagger-3">
          <div className="stats-page__chart-header">
            <span className="stats-page__section-title">Progress</span>
            <div className="stats-page__tabs">
              {(['breathing', 'cold'] as ChartTab[]).map(t => (
                <button
                  key={t}
                  className={`stats-page__tab ${tab === t ? 'stats-page__tab--active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {tab === 'breathing' && (
            <LineChart
              data={stats.breathingChart}
              formatY={formatSecs}
              yLabel="hold time"
              emptyText="No breathing sessions yet"
            />
          )}
          {tab === 'cold' && (
            <LineChart
              data={stats.coldChart}
              formatY={formatSecs}
              yLabel="duration"
              emptyText="No cold sessions yet"
            />
          )}
        </section>
      </div>
    </PageTransition>
  )
}
