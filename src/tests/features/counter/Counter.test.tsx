import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { Counter } from '@/features/counter/components/Counter';

test('incrementing updates the count and the derived parity', () => {
  renderWithProviders(<Counter />);

  expect(screen.getByText(/מונה: 0/)).toBeDefined();
  expect(screen.getByText(/זוגי/)).toBeDefined();

  fireEvent.click(screen.getByRole('button', { name: 'הגדל' }));

  expect(screen.getByText(/מונה: 1/)).toBeDefined();
  expect(screen.getByText(/אי־זוגי/)).toBeDefined();
});

test('changing the step makes increments jump by that amount', () => {
  renderWithProviders(<Counter />);

  fireEvent.change(screen.getByRole('spinbutton', { name: 'צעד' }), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: 'הגדל' }));

  expect(screen.getByText(/מונה: 5/)).toBeDefined();
});

test('reset returns the counter to its initial state', () => {
  renderWithProviders(<Counter />);

  fireEvent.click(screen.getByRole('button', { name: 'הגדל' }));
  fireEvent.click(screen.getByRole('button', { name: 'איפוס' }));

  expect(screen.getByText(/מונה: 0/)).toBeDefined();
});
