import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import './App.css'

export function App() {
  const [isDashboard, setIsDashboard] = useState(window.location.pathname === '/')

  useEffect(() => {
    // Subscribe to router navigation events
    const unsubscribe = router.subscribe((state) => {
      setIsDashboard(state.location.pathname === '/')
    })

    return unsubscribe
  }, [])

  return (
    <LanguageProvider>
      <div className={`ambient-glow ${!isDashboard ? 'ambient-glow--minimal' : ''}`} />
      <div className={`ambient-orbs ${!isDashboard ? 'ambient-orbs--minimal' : ''}`} />
      <div className="vignette" />
      <div className="grain">
        <svg>
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>
      </div>
      <RouterProvider router={router} />
    </LanguageProvider>
  )
}
