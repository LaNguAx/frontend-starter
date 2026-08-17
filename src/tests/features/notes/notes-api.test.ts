import { makeStore } from '@/redux/store';
import { notesApi } from '@/features/notes/notes-api';
import { resetNotes } from '@/features/notes/notes-handlers';

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
