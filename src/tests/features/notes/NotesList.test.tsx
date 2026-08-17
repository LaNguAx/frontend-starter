import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { NotesList } from '@/features/notes/components/NotesList';
import { resetNotes } from '@/features/notes/mocks/notes-handlers';

beforeEach(() => resetNotes());

test('renders the notes fetched from the mocked api', async () => {
  renderWithProviders(<NotesList />);

  expect(await screen.findByText('קניות לשבת')).toBeDefined();
  expect(screen.getByText('Starter ideas')).toBeDefined();
});
