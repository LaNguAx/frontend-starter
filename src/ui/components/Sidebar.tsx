import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();

  return <aside className="w-64 bg-green-200 p-4">{t('layout.sidebar')}</aside>;
}
