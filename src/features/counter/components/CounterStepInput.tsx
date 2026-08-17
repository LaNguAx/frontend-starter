import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/redux-hooks';
import { selectStep, stepChanged } from '@/features/counter/counter-slice';

export function CounterStepInput() {
  const { t } = useTranslation();
  const step = useAppSelector(selectStep);
  const dispatch = useAppDispatch();

  return (
    <label className="flex items-center gap-2">
      {t('counter.step')}
      <input
        type="number"
        min={1}
        value={step}
        onChange={(event) => dispatch(stepChanged(Number(event.target.value)))}
        className="w-20 rounded border border-gray-300 bg-white p-1"
      />
    </label>
  );
}
