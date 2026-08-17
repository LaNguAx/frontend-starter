import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();

  return <header className="bg-blue-200 p-4 font-semibold">{t('layout.header')}</header>;
}
