import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { NotesList } from '@/features/notes/components/NotesList';
import { resetNotes } from '@/features/notes/mocks/notes-handlers';

beforeEach(() => resetNotes());

test('renders the notes fetched from the mocked api', async () => {
  renderWithProviders(<NotesList />);

  expect(await screen.findByText('קניות לשבת')).toBeDefined();
  expect(screen.getByText('Starter ideas')).toBeDefined();
});

test('canceling the delete confirmation keeps the note', async () => {
  renderWithProviders(<NotesList />);

  const item = (await screen.findByText('קניות לשבת')).closest('li')!;
  fireEvent.click(within(item).getByRole('button', { name: 'מחיקה' }));

  // Radix AlertDialog renders with role="alertdialog"; scope queries to it because
  // the confirm button shares its label with the per-note delete triggers
  const dialog = screen.getByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'ביטול' }));

  expect(screen.queryByRole('alertdialog')).toBeNull();
  expect(screen.getByText('קניות לשבת')).toBeDefined();
});

test('confirming the delete removes the note', async () => {
  renderWithProviders(<NotesList />);

  const item = (await screen.findByText('קניות לשבת')).closest('li')!;
  fireEvent.click(within(item).getByRole('button', { name: 'מחיקה' }));

  const dialog = screen.getByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'מחיקה' }));

  // Tag invalidation refetches the list; the deleted note disappears
  await waitFor(() => expect(screen.queryByText('קניות לשבת')).toBeNull());
  expect(screen.getByText('Starter ideas')).toBeDefined();
});
