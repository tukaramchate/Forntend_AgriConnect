import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import language resources
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import te from './locales/te/translation.json';
import mr from './locales/mr/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      mr: { translation: mr },
    },
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // Regional and formatting options
    lng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'mr'],
  });

export default i18n;
