import { useState } from 'react'
import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import { BackButton } from '@/shared/ui/BackButton/BackButton'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import { useStats, formatSecs } from './hooks/useStats'
import type { Period } from './hooks/useStats'
import { MetricCard } from './components/MetricCard'
import { ActivityGrid } from './components/ActivityGrid'
import { LineChart } from './components/LineChart'
import './StatsPage.css'

type ChartTab = 'breathing' | 'cold'

export function StatsPage() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<Period>('month')
  const [tab, setTab] = useState<ChartTab>('breathing')
  const stats = useStats(period)

  return (
    <PageTransition>
      <div className="stats-page">
        {/* Top bar */}
        <div className="stats-page__top">
          <BackButton />
          <h1 className="stats-page__title">{t('statsTitle')}</h1>
          <div className="stats-page__period">
            {(['week', 'month', '3months'] as Period[]).map(p => (
              <button
                key={p}
                className={`stats-page__period-btn ${period === p ? 'stats-page__period-btn--active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? t('period7d') : p === 'month' ? t('period30d') : t('period90d')}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <section className="stats-page__section fade-up stagger-1">
          <div className="stats-page__metrics">
            <MetricCard
              value={String(stats.breathingThisMonth)}
              label={t('breathingLabel')}
              sublabel={t('thisMonth')}
              trend={stats.breathingThisMonth - stats.breathingLastMonth}
              trendLabel={t('vsLastMonth')}
            />
            <MetricCard
              value={formatSecs(stats.bestHoldThisMonth)}
              label={t('bestHoldLabel')}
              sublabel={t('thisMonth')}
              trend={stats.bestHoldThisMonth - stats.bestHoldLastMonth}
              trendLabel={t('vsLastMonth')}
            />
            <MetricCard
              value={String(stats.coldThisMonth)}
              label={t('coldLabel')}
              sublabel={t('thisMonth')}
              trend={stats.coldThisMonth - stats.coldLastMonth}
              trendLabel={t('vsLastMonth')}
            />
            <MetricCard
              value={String(stats.coldStreak)}
              label={t('coldStreakLabel')}
              sublabel={t('daysInRow')}
            />
          </div>
        </section>

        {/* Activity grid */}
        <section className="stats-page__section fade-up stagger-2">
          <span className="stats-page__section-title">{t('activityLast90')}</span>
          <ActivityGrid days={stats.activityGrid} />
          <div className="stats-page__legend">
            <span className="stats-page__legend-label">{t('less')}</span>
            {[0, 1, 2, 3].map(n => (
              <div key={n} className={`activity-cell activity-cell--${n}`} style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0 }} />
            ))}
            <span className="stats-page__legend-label">{t('more')}</span>
          </div>
        </section>

        {/* Charts */}
        <section className="stats-page__section fade-up stagger-3">
          <div className="stats-page__chart-header">
            <span className="stats-page__section-title">{t('progress')}</span>
            <div className="stats-page__tabs">
              {(['breathing', 'cold'] as ChartTab[]).map(tabType => (
                <button
                  key={tabType}
                  className={`stats-page__tab ${tab === tabType ? 'stats-page__tab--active' : ''}`}
                  onClick={() => setTab(tabType)}
                >
                  {t(tabType === 'breathing' ? 'breathingLabel' : 'coldLabel')}
                </button>
              ))}
            </div>
          </div>

          {tab === 'breathing' && (
            <LineChart
              data={stats.breathingChart}
              formatY={formatSecs}
              yLabel={t('holdTime')}
              emptyText={t('noBreathingSessions')}
            />
          )}
          {tab === 'cold' && (
            <LineChart
              data={stats.coldChart}
              formatY={formatSecs}
              yLabel={t('duration')}
              emptyText={t('noColdSessions')}
            />
          )}
        </section>
      </div>
    </PageTransition>
  )
}
