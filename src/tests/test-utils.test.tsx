import { screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import { renderWithRouterAndProviders } from '@/tests/test-utils';

function LocationProbe() {
  return <span>{useLocation().pathname}</span>;
}

test('renderWithRouterAndProviders supplies router context and an initial entry', () => {
  renderWithRouterAndProviders([{ path: '/target', Component: LocationProbe }], {
    initialEntries: ['/target']
  });

  expect(screen.getByText('/target')).toBeDefined();
});
