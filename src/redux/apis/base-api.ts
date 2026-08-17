import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/consts/env';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.VITE_API_BASE_URL }),
  tagTypes: [],
  endpoints: () => ({}),
  // Endpoint schemas (responseSchema/argSchema) validate data at runtime. Without this,
  // a schema failure is FATAL (skips tag invalidation etc.) — converting it into a
  // regular base-query error lets components handle it as a normal isError state.
  catchSchemaFailure: (error) => ({
    status: 'CUSTOM_ERROR' as const,
    error: `Schema validation failed (${error.schemaName})`,
    data: error.issues
  })
});
