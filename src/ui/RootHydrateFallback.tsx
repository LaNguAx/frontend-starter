import { useTranslation } from 'react-i18next';
import { Spinner } from '@/ui/components/Spinner';

// Shown while a lazy route chunk loads on the initial page load
export function RootHydrateFallback() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center gap-3">
      <Spinner />
      <span>{t('common.loading')}</span>
    </div>
  );
}
