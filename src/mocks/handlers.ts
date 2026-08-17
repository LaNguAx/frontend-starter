import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example handler — replace with your real API mocks
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' }))
];
