import { render, screen } from '@testing-library/react';
import { HomePage } from '@/ui/pages/HomePage';

test('renders the Hebrew welcome message by default', () => {
  render(<HomePage />);

  expect(screen.getByRole('heading', { name: 'ברוכים הבאים לסטארטר' })).toBeDefined();
});
