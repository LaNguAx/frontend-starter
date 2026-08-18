import type { PropsWithChildren, ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { makeStore } from '@/redux/store';

// Renders with a FRESH store per call so tests never share state
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const store = makeStore();

  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

interface RouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

export function renderWithRouterAndProviders(
  routes: RouteObject[],
  { initialEntries = ['/'], ...options }: RouterRenderOptions = {}
) {
  const store = makeStore();
  const router = createMemoryRouter(routes, { initialEntries });

  return {
    store,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
      options
    )
  };
}
