import { http, HttpResponse } from 'msw';
import { notesHandlers } from '@/features/notes/mocks/notes-handlers';

// Aggregator only — each feature owns its handlers and gets spread in here
export const handlers = [http.get('/api/health', () => HttpResponse.json({ status: 'ok' })), ...notesHandlers];
