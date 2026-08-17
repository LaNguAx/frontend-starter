import { isRouteErrorResponse, useRouteError } from 'react-router';

export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
    </main>
  );
}
