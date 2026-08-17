import type { Note } from '@/features/notes/notes-types';

// Static, deterministic mock data — shared by the MSW handlers and the tests
export const notesFixtures: Note[] = [
  {
    id: '1',
    title: 'קניות לשבת',
    content: 'חלה, יין, פרחים',
    createdAt: '2026-08-10T09:00:00.000Z'
  },
  {
    id: '2',
    title: 'Starter ideas',
    content: 'Write the README, add CI',
    createdAt: '2026-08-12T14:30:00.000Z'
  }
];
