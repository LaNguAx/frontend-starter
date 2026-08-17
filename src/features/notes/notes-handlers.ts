import { http, HttpResponse } from 'msw';
import { notesFixtures } from '@/features/notes/notes-fixtures';
import type { CreateNoteInput, Note } from '@/features/notes/notes-types';

// In-memory state so mutations behave realistically in dev and tests
let notes: Note[] = [...notesFixtures];

// Stateful handlers must expose a reset for test isolation (call it in beforeEach)
export function resetNotes() {
  notes = [...notesFixtures];
}

export const notesHandlers = [
  http.get('/api/notes', () => HttpResponse.json(notes)),

  http.post('/api/notes', async ({ request }) => {
    const input = (await request.json()) as CreateNoteInput;
    const note: Note = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString()
    };
    notes.push(note);
    return HttpResponse.json(note, { status: 201 });
  }),

  http.delete('/api/notes/:id', ({ params }) => {
    notes = notes.filter((note) => note.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  })
];
