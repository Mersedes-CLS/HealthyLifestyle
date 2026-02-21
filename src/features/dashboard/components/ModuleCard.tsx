import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/ui/Card/Card'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import type { ModuleInfo } from '@/shared/types'
import './ModuleCard.css'

interface ModuleCardProps {
  module: ModuleInfo
  index: number
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleClick = () => {
    if (module.status === 'active') {
      navigate(module.path)
    }
  }

  return (
    <Card
      onClick={module.status === 'active' ? handleClick : undefined}
      className={`module-card fade-up stagger-${index + 2} ${module.status === 'coming-soon' ? 'module-card--disabled' : ''}`}
    >
      <span className="module-card__emoji">{module.emoji}</span>
      <h3 className="module-card__title">{module.title}</h3>
      <p className="module-card__description">{module.description}</p>
      {module.status === 'coming-soon' && (
        <span className="module-card__badge label-sm">{t('comingSoon')}</span>
      )}
    </Card>
  )
}
