import type { RouteObject } from 'react-router';

// The feature owns its route: path + lazy-loaded page (code-split into its own chunk).
// Registered in src/routes/router.ts.
export const counterRoute: RouteObject = {
  path: 'counter',
  lazy: async () => ({ Component: (await import('@/features/counter/pages/CounterPage')).CounterPage })
};
