import { useTranslation } from 'react-i18next';

export function Spinner() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-label={t('common.loading')}
      className="size-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
    />
  );
}
