import React from "react";
import useTranslation from "../../language/useTranslation";

const UnauthorizedViewSecurity = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.security) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.security.title}
      </h1>
      <div className="space-y-4">
        <p className="text-md text-gray-700">{t.security.intro}</p>
        <p className="text-md text-gray-700">{t.security.protocols}</p>
        <p className="text-md text-gray-700">{t.security.tools}</p>
        <p className="text-md text-red-700">{t.security.warning}</p>
      </div>
    </div>
  );
};

export default UnauthorizedViewSecurity;
