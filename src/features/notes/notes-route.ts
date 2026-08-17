import type { RouteObject } from 'react-router';

// The feature owns its route: path + lazy-loaded page (code-split into its own chunk).
// Registered in src/routes/router.ts.
export const notesRoute: RouteObject = {
  path: 'notes',
  lazy: async () => ({ Component: (await import('@/features/notes/pages/NotesPage')).NotesPage })
};
