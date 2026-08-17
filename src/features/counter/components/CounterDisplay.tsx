import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks/redux-hooks';
import { selectCount, selectIsEven } from '@/features/counter/counter-slice';

export function CounterDisplay() {
  const { t } = useTranslation();
  const count = useAppSelector(selectCount);
  const isEven = useAppSelector(selectIsEven);

  return (
    <p className="text-lg">
      {t('counter.count', { count })} · {t(isEven ? 'counter.even' : 'counter.odd')}
    </p>
  );
}
