import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './App.css'

export function App() {
  return (
    <>
      <div className="ambient-glow" />
      <div className="grain">
        <svg>
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>
      </div>
      <RouterProvider router={router} />
    </>
  )
}
