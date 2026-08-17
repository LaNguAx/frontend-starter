import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/ui/RootLayout';
import { RootErrorBoundary } from '@/ui/RootErrorBoundary';
import { HomePage } from '@/ui/pages/HomePage';

// Rendered while a lazy route chunk loads on the initial navigation
function RootHydrateFallback() {
  return null;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    HydrateFallback: RootHydrateFallback,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'notes',
        // Lazy route: the notes feature is code-split into its own chunk
        lazy: async () => {
          const { NotesPage } = await import('@/features/notes/pages/NotesPage');
          return { Component: NotesPage };
        }
      }
    ]
  }
]);
