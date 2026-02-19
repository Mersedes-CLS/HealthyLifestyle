import { type ReactNode } from 'react'
import './PageTransition.css'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-transition">{children}</div>
}
