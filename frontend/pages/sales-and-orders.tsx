import React from "react";
import useTranslation from "../app/components/language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";
import { CardOne } from "@/app/components/pagesComponent/sales/CardOne";
import { CardSecond } from "@/app/components/pagesComponent/sales/CardSecond";
import { CardThird } from "@/app/components/pagesComponent/sales/CardThird";
import { Divider } from "@mui/material";

const SalesAndOrders = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.sales_and_orders) {
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
        <CardThird />
      <Divider sx={{ maxWidth: 995 }}/>
      
    </div>
  );
};

export default SalesAndOrders;
