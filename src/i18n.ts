
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Initialize i18next instance
const configOptions = {
  debug: true,
  ns: ['common'],
  defaultNS: 'common',
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ['en', 'es'],
  initImmediate: false,
};

  // for browser use http backend to load translations and browser lng detector
if (process && !process.release) {
  i18n.use(Backend).use(initReactI18next).use(LanguageDetector);
}

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(configOptions);
}

export default i18n;