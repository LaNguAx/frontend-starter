import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">{t('home.welcome')}</h1>
      <p>{t('home.intro1')}</p>
      <p>{t('home.intro2')}</p>
      <p>{t('home.intro3')}</p>
    </div>
  );
}
