import type he from '@/consts/i18n/he.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof he;
    };
  }
}
