import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import he from '@/consts/i18n/he.json';
import en from '@/consts/i18n/en.json';

export const defaultNS = 'translation';

// Keep <html lang> and <html dir> in sync with the active language (Hebrew is RTL)
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en }
    },
    fallbackLng: 'he',
    supportedLngs: ['he', 'en'],
    detection: {
      // Hebrew-first: never auto-detect from the browser language — only an
      // explicit choice (?lng=) or a remembered previous choice overrides Hebrew
      order: ['querystring', 'localStorage'],
      caches: ['localStorage']
    },
    // Treat regional variants (en-US, he-IL) as their base language
    load: 'languageOnly',
    defaultNS,
    interpolation: {
      // React already escapes rendered values
      escapeValue: false
    }
  });

export default i18n;
