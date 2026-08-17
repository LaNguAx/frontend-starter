import { CounterDisplay } from '@/features/counter/components/CounterDisplay';
import { CounterStepInput } from '@/features/counter/components/CounterStepInput';
import { CounterControls } from '@/features/counter/components/CounterControls';

export function Counter() {
  return (
    <div className="flex max-w-md flex-col gap-3 rounded border border-gray-300 bg-white p-4">
      <CounterDisplay />
      <CounterStepInput />
      <CounterControls />
    </div>
  );
}
