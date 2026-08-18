import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return <footer className="bg-gray-300 p-4">{t('app.title')}</footer>;
}
