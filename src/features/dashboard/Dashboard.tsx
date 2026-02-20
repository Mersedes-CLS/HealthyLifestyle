import { PageTransition } from '@/shared/ui/PageTransition/PageTransition'
import type { ModuleInfo } from '@/shared/types'
import { Header } from './components/Header'
import { ModuleCard } from './components/ModuleCard'
import './Dashboard.css'

const modules: ModuleInfo[] = [
  {
    id: 'breathing',
    title: 'Breathing',
    description: 'Wim Hof method, breath retention, guided sessions',
    emoji: '\uD83E\uDEC1',
    path: '/breathing',
    status: 'active',
  },
  {
    id: 'smoking',
    title: 'Smoke Free',
    description: 'Days counter, money saved, health recovery timeline',
    emoji: '\uD83D\uDEAD',
    path: '/smoking',
    status: 'coming-soon',
  },
  {
    id: 'cold',
    title: 'Cold Exposure',
    description: 'Cold plunge timer, session log, streaks',
    emoji: '\uD83E\uDDCA',
    path: '/cold',
    status: 'active',
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Workout programs, exercise logging',
    emoji: '\uD83C\uDFCB\uFE0F',
    path: '/training',
    status: 'coming-soon',
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Calories, macros, intermittent fasting',
    emoji: '\uD83C\uDF7D',
    path: '/nutrition',
    status: 'coming-soon',
  },
  {
    id: 'stats',
    title: 'Statistics',
    description: 'Overall dashboard with all metrics',
    emoji: '\uD83D\uDCCA',
    path: '/stats',
    status: 'active',
  },
]

export function Dashboard() {
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
