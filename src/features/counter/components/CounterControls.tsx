import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks/redux-hooks';
import { decremented, incremented, reset } from '@/features/counter/counter-slice';

export function CounterControls() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => dispatch(incremented())}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {t('counter.increment')}
      </button>
      <button
        type="button"
        onClick={() => dispatch(decremented())}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {t('counter.decrement')}
      </button>
      <button
        type="button"
        onClick={() => dispatch(reset())}
        className="rounded border border-gray-400 px-4 py-2 hover:bg-gray-100"
      >
        {t('counter.reset')}
      </button>
    </div>
  );
}
