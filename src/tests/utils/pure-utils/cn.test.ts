import { cn } from '@/utils/pure-utils/cn';

test('drops falsy values like clsx', () => {
  expect(cn('rounded', undefined, 'p-2')).toBe('rounded p-2');
});

test('later tailwind utilities win conflicts', () => {
  expect(cn('p-2 text-red-600', 'p-4')).toBe('text-red-600 p-4');
});
