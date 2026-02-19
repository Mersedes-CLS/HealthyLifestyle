import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

import './styles/variables.css'
import './styles/reset.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/ambient.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
