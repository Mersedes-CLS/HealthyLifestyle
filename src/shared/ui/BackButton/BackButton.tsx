import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import './BackButton.css'

export function BackButton() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <button className="back-button" onClick={() => navigate('/')}>
      <span className="back-button__arrow">&#8592;</span>
      <span className="back-button__text">{t('back')}</span>
    </button>
  )
}
