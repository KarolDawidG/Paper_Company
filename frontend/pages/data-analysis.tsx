import React from "react";
import useTranslation from "../app/components/language/useTranslation";

const DataAnalysis = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.data_analysis) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.data_analysis.title}
      </h1>
      <div className="space-y-4">
        <p className="text-md text-gray-700">{t.data_analysis.intro}</p>
        <p className="text-md text-gray-700">{t.data_analysis.protocols}</p>
        <p className="text-md text-gray-700">{t.data_analysis.tools}</p>
        <p className="text-md text-red-700">{t.data_analysis.warning}</p>
      </div>
    </div>
  );
};

export default DataAnalysis;
