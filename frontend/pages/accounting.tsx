import React from "react";
import useTranslation from "../app/components/language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";

const Accounting = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.accounting) {
    return <LinearProgress />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.accounting.title}
      </h1>
      <div className="space-y-4">
        <p className="text-md text-gray-700">{t.accounting.intro}</p>
        <p className="text-md text-gray-700">{t.accounting.protocols}</p>
        <p className="text-md text-gray-700">{t.accounting.tools}</p>
        <p className="text-md text-red-700">{t.accounting.warning}</p>
      </div>
    </div>
  );
};

export default Accounting;
