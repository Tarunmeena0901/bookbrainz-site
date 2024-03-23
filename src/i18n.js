import Backend from 'i18next-fs-backend';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import path from 'path';


i18n
  .use(Backend)
  .init({
    debug: true,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    lng: 'en',
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    supportedLngs: ['en', 'es'],
    initImmediate: false,
    backend: {
      loadPath: path.resolve(__dirname,'./public/locales/{{lng}}/common.json'),
    },
    react: {
      useSuspense: false,
    },
    preload: ['en' ,'es'],
    load: 'languageOnly'
  });

export default i18n;