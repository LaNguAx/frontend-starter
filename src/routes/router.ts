import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/ui/RootLayout';
import { RootErrorBoundary } from '@/ui/RootErrorBoundary';
import { HomePage } from '@/ui/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [{ index: true, Component: HomePage }]
  }
]);
