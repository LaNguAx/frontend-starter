import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { HomePage } from '@/ui/pages/HomePage';

test('renders the Hebrew welcome message by default', () => {
  renderWithProviders(<HomePage />);

  expect(screen.getByRole('heading', { name: 'ברוכים הבאים לסטארטר' })).toBeDefined();
});
