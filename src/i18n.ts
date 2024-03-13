import express from 'express';
import i18next from 'i18next';
import { LanguageDetector } from 'i18next-express-middleware';
import i18nextMiddleware from 'i18next-http-middleware'; // Import i18next-http-middleware
import Backend from 'i18next-http-backend';

const app = express();

// Initialize i18next instance
i18next
  .use(Backend) // Use i18next-http-backend
  .use(LanguageDetector)
  .init({
    debug: true,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '../static/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['header'],
    },
    preload: ['en'],
    supportedLngs: ['en', 'de', 'es', 'fr'],
  });

// Use i18next middleware
app.use((req, res, next) => {
  i18nextMiddleware.handle(i18next)(req, res, next);
});
