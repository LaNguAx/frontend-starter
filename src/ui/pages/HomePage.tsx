import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();

  return <h1 className="text-xl font-bold">{t('home.welcome')}</h1>;
}
