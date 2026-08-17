import { useTranslation } from 'react-i18next';
import { Counter } from '@/features/counter/components/Counter';

export function CounterPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t('counter.title')}</h1>
      <Counter />
    </div>
  );
}
