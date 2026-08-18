import { screen } from '@testing-library/react';
import { renderWithRouterAndProviders } from '@/tests/test-utils';
import { RootErrorBoundary } from '@/ui/RootErrorBoundary';

test('renders translated fallback text for an unknown route error', async () => {
  renderWithRouterAndProviders([
    {
      path: '/',
      loader: () => {
        throw new Error('');
      },
      ErrorBoundary: RootErrorBoundary
    }
  ]);

  expect(await screen.findByRole('heading', { name: 'משהו השתבש' })).toBeDefined();
  expect(screen.getByText('שגיאה לא ידועה')).toBeDefined();
});
