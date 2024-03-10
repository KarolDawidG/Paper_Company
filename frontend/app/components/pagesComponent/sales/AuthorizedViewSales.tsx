import React from 'react';
import useTranslation from "../../language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";
import { CardOne } from './Cards/CardOne';
import { Divider } from '@mui/material';
import { CardSecond } from './Cards/CardSecond';
import { CardThird } from './Cards/CardThird';

const AuthorizedViewSales = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.security) {
    return <LinearProgress />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {t.sales_and_orders.title}
      </h1>
      <Divider sx={{ maxWidth: 995 }}/>
        <CardOne />
      <Divider sx={{ maxWidth: 995 }}/>
        <CardSecond />
      <Divider sx={{ maxWidth: 995 }}/>
        <CardThird/>
      <Divider sx={{ maxWidth: 995 }}/>
    </div>
  );
};

export default AuthorizedViewSales;
