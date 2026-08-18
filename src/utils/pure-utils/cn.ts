import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Compose conditional classes (clsx) and resolve Tailwind conflicts (twMerge):
// cn('p-2', isBig && 'p-4') → 'p-4'. Use this for any className built from parts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
