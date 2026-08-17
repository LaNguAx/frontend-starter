import { server } from '@/mocks/node';
import '@/consts/i18n';

// MSW lifecycle (per official Vitest integration docs)
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
