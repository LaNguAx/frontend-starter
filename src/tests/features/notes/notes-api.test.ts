import { http, HttpResponse } from 'msw';
import { makeStore } from '@/redux/store';
import { server } from '@/mocks/node';
import { notesApi } from '@/features/notes/notes-api';
import { resetNotes } from '@/features/notes/mocks/notes-handlers';

beforeEach(() => resetNotes());

test('getNotes returns the fixture notes through msw', async () => {
  const store = makeStore();

  const notes = await store.dispatch(notesApi.endpoints.getNotes.initiate()).unwrap();

  expect(notes).toHaveLength(2);
  expect(notes[0].title).toBe('קניות לשבת');
});

test('createNote adds a note that subsequent fetches return', async () => {
  const store = makeStore();

  const created = await store
    .dispatch(notesApi.endpoints.createNote.initiate({ title: 'פתק חדש', content: 'תוכן' }))
    .unwrap();

  expect(created.id).toBeDefined();

  const notes = await store.dispatch(notesApi.endpoints.getNotes.initiate()).unwrap();
  expect(notes).toHaveLength(3);
});

test('deleteNote removes the note', async () => {
  const store = makeStore();

  await store.dispatch(notesApi.endpoints.deleteNote.initiate('1')).unwrap();

  const notes = await store.dispatch(notesApi.endpoints.getNotes.initiate()).unwrap();
  expect(notes).toHaveLength(1);
});

test('extra fields in the response are tolerated and stripped', async () => {
  server.use(
    http.get('/api/notes', () =>
      HttpResponse.json([
        {
          id: '1',
          title: 'כותרת',
          content: 'תוכן',
          createdAt: '2026-08-10T09:00:00.000Z',
          likes: 12,
          owner: 'someone-new'
        }
      ])
    )
  );
  const store = makeStore();

  const notes = await store.dispatch(notesApi.endpoints.getNotes.initiate()).unwrap();

  expect(notes).toHaveLength(1);
  expect(notes[0].title).toBe('כותרת');
  // Unknown keys are stripped by z.object() — additive backend changes never break the UI
  expect(notes[0]).not.toHaveProperty('likes');
});

test('a malformed api response fails schema validation instead of reaching the UI', async () => {
  // Override the handler for this test only: the "backend" returns garbage
  server.use(http.get('/api/notes', () => HttpResponse.json([{ nope: true }])));
  const store = makeStore();

  const result = await store.dispatch(notesApi.endpoints.getNotes.initiate());

  expect(result.isError).toBe(true);
  // catchSchemaFailure (base-api) converts the failure into a normal query error
  expect(result.error).toMatchObject({ status: 'CUSTOM_ERROR' });
});
