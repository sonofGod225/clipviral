'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { useEffect } from 'react';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force a re-render when the language changes
    i18next.on('languageChanged', () => {
      document.documentElement.lang = i18next.language;
    });

    return () => {
      i18next.off('languageChanged');
    };
  }, []);

  return children;
} 