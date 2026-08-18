import { isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';

export function RootErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

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
      <h1 className="text-2xl font-bold">{t('common.somethingWentWrong')}</h1>
      <p>{error instanceof Error && error.message ? error.message : t('common.unknownError')}</p>
    </main>
  );
}
