import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/consts/env';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.VITE_API_BASE_URL }),
  tagTypes: [],
  endpoints: () => ({})
});
