import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { Footer } from '@/ui/components/Footer';

test('renders the translated app title', () => {
  renderWithProviders(<Footer />);

  expect(screen.getByText('סטארטר פרונטאנד')).toBeDefined();
});
