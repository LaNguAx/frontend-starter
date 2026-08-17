import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { NoteForm } from '@/features/notes/components/NoteForm';

test('shows translated validation errors when submitting empty fields', async () => {
  renderWithProviders(<NoteForm />);

  fireEvent.click(screen.getByRole('button', { name: 'הוספת פתק' }));

  expect(await screen.findByText('כותרת נדרשת')).toBeDefined();
  expect(screen.getByText('תוכן נדרש')).toBeDefined();
});
