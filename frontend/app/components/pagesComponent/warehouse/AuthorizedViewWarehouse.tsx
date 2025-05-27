import React from 'react';
import useTranslation from "../../language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";
import CustomTable from './UsersTable/Table';

const AuthorizedViewWarehouse = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.warehouse) {
    return <LinearProgress />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        <p>{t.warehouse.title}</p>
        <CustomTable />
      </h1>
    </div>
  );
};

export default AuthorizedViewWarehouse;
