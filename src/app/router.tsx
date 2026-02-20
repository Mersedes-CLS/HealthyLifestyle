import { createBrowserRouter } from 'react-router-dom'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { BreathingPage } from '@/features/breathing/BreathingPage'
import { ColdPage } from '@/features/cold/ColdPage'
import { StatsPage } from '@/features/stats/StatsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  // Phase 1
  { path: '/breathing', element: <BreathingPage /> },

  // Phase 2
  // { path: '/smoking', element: <SmokingPage /> },
  { path: '/cold', element: <ColdPage /> },

  // Phase 3
  // { path: '/training', element: <TrainingPage /> },
  // { path: '/nutrition', element: <NutritionPage /> },
  { path: '/stats', element: <StatsPage /> },
])
