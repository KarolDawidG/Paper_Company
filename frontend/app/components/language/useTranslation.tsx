import { useState, useEffect } from "react";

type Translation = Record<string, any>;

const useTranslation = (locale: string) => {
  const [translations, setTranslations] = useState<Translation>(
    {} as Translation,
  );

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await import(`../../locales/${locale}/common.json`);
      setTranslations(translations.default);
    };

    loadTranslations();
  }, [locale]);

  return translations;
};

export default useTranslation;
