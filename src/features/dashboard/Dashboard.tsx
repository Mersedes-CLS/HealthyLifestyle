import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import type { ModuleInfo } from '@/shared/types'
import { Header } from './components/Header'
import { ModuleCard } from './components/ModuleCard'
import './Dashboard.css'

export function Dashboard() {
  const { t } = useLanguage()

  const modules: ModuleInfo[] = [
    {
      id: 'breathing',
      title: t('breathing'),
      description: t('breathingDesc'),
      emoji: '\uD83E\uDEC1',
      path: '/breathing',
      status: 'active',
    },
    {
      id: 'smoking',
      title: t('smokeFree'),
      description: t('smokeFreeDesc'),
      emoji: '\uD83D\uDEAD',
      path: '/smoking',
      status: 'coming-soon',
    },
    {
      id: 'cold',
      title: t('coldExposure'),
      description: t('coldExposureDesc'),
      emoji: '\uD83E\uDDCA',
      path: '/cold',
      status: 'active',
    },
    {
      id: 'training',
      title: t('training'),
      description: t('trainingDesc'),
      emoji: '\uD83C\uDFCB\uFE0F',
      path: '/training',
      status: 'coming-soon',
    },
    {
      id: 'nutrition',
      title: t('nutrition'),
      description: t('nutritionDesc'),
      emoji: '\uD83C\uDF7D',
      path: '/nutrition',
      status: 'coming-soon',
    },
    {
      id: 'stats',
      title: t('statistics'),
      description: t('statisticsDesc'),
      emoji: '\uD83D\uDCCA',
      path: '/stats',
      status: 'active',
    },
  ]

  return (
    <PageTransition>
      <div className="dashboard">
        <Header />
        <div className="dashboard__grid">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
