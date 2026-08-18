import { useTranslation } from 'react-i18next';

export function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    void i18n.changeLanguage(i18n.resolvedLanguage === 'he' ? 'en' : 'he');
  };

  return (
    <header className="flex items-center justify-between bg-blue-200 p-4">
      <span className="font-semibold">{t('app.title')}</span>
      <button
        type="button"
        onClick={toggleLanguage}
        className="rounded border border-blue-400 bg-white px-3 py-1 text-sm hover:bg-blue-50"
      >
        {t('layout.toggleLanguage')}
      </button>
    </header>
  );
}
