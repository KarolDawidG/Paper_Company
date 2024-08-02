import { useState, useEffect } from "react";
import useTranslation from "@/app/components/language/useTranslation";

const useTranslationStatus = (currentLocale: string) => {
  const t = useTranslation(currentLocale);
  const [isTranslationLoaded, setTranslationLoaded] = useState(false);

  useEffect(() => {
    if (t.notification) {
      setTranslationLoaded(true);
    }
  }, [t.notification]);

  return isTranslationLoaded;
};

export default useTranslationStatus;
