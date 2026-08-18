import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { Header } from '@/ui/components/Header';

test('renders the translated app title', () => {
  renderWithProviders(<Header />);

  expect(screen.getByText('סטארטר פרונטאנד')).toBeDefined();
});
