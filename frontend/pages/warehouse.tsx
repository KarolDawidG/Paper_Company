import React from "react";
import useTranslation from "../app/components/language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";

const Warehouse = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.warehouse) {
    return <LinearProgress />
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.warehouse.title}
      </h1>
      <div className="space-y-4">
        <p className="text-md text-gray-700">{t.warehouse.intro}</p>
        <p className="text-md text-gray-700">{t.warehouse.protocols}</p>
        <p className="text-md text-gray-700">{t.warehouse.tools}</p>
        <p className="text-md text-red-700">{t.warehouse.warning}</p>
      </div>
    </div>
  );
};

export default Warehouse;
