import { useLanguage } from '@/shared/i18n/LanguageContext'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher/LanguageSwitcher'
import './Header.css'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="header fade-up stagger-1">
      <div className="header__lang-switcher">
        <LanguageSwitcher />
      </div>
      <h1 className="header__title">{t('appTitle')}</h1>
      <p className="header__subtitle label">{t('appSubtitle')}</p>
    </header>
  )
}
