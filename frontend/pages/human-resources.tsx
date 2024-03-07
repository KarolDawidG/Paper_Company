import React from "react";
import useTranslation from "../app/components/language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";

const HumanResources = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.human_resources) {
    return <LinearProgress />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.human_resources.title}
      </h1>
      <div className="space-y-4">
        <p className="text-md text-gray-700">{t.human_resources.intro}</p>
        <p className="text-md text-gray-700">{t.human_resources.protocols}</p>
        <p className="text-md text-gray-700">{t.human_resources.tools}</p>
        <p className="text-md text-red-700">{t.human_resources.warning}</p>
      </div>
    </div>
  );
};

export default HumanResources;
