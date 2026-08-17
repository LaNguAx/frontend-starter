import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/ui/RootLayout';
import { RootErrorBoundary } from '@/ui/RootErrorBoundary';
import { RootHydrateFallback } from '@/ui/RootHydrateFallback';
import { HomePage } from '@/ui/pages/HomePage';
import { counterRoute } from '@/features/counter/counter-route';
import { notesRoute } from '@/features/notes/notes-route';

// Composition only: shared pages are eager, feature routes are owned by their
// features (each a lazy, code-split RouteObject) and just registered here.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    HydrateFallback: RootHydrateFallback,
    children: [{ index: true, Component: HomePage }, counterRoute, notesRoute]
  }
]);
