import { useTranslation } from 'react-i18next';
import { Counter } from '@/features/counter/components/Counter';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t('home.welcome')}</h1>
      <Counter />
    </div>
  );
}
