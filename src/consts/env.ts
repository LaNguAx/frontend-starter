import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api'),
  VITE_ENABLE_MOCKS: z.enum(['true', 'false']).optional()
});

// Fails fast at startup if a required VITE_ variable is missing or malformed
export const env = envSchema.parse(import.meta.env);
