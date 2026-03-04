import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import ma from './locales/ma.json';

export const RTL_LANGUAGES = ['ar', 'ma'];
export const DASHBOARD_LANGUAGES = ['en', 'fr'];
export const isRTL = (lang: string) => RTL_LANGUAGES.includes(lang);
export const isDashboardLang = (lang: string) => DASHBOARD_LANGUAGES.includes(lang);

const STORAGE_KEY = 'fleetmark_lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, fr, ar, ma },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

// Set direction on language change
const applyDirection = (lng: string) => {
  const dir = isRTL(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  if (isRTL(lng)) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
};

// Apply on init
applyDirection(i18n.language || 'en');

// Apply on change
i18n.on('languageChanged', applyDirection);

export default i18n;
