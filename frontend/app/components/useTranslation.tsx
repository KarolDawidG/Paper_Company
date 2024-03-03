import { useState, useEffect } from 'react';

interface Translation {
    security: {
      title: string;
      intro: string;
      protocols: string;
      tools: string;
      warning: string;
    };
    // Możesz dodać więcej definicji dla innych sekcji tłumaczeń
  }

  
const useTranslation = (locale:string) => {
    const [translations, setTranslations] = useState<Translation>({} as Translation);

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await import(`../locales/${locale}/common.json`);
      setTranslations(translations.default);
    };

    loadTranslations();
  }, [locale]);

  return translations;
};

export default useTranslation;
