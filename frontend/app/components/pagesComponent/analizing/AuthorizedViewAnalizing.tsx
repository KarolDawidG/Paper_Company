import React from 'react';
import useTranslation from "../../language/useTranslation";
import { Grid, Typography, LinearProgress } from '@mui/material';
import { CartProvider } from "@/app/components/pagesComponent/sales/Cards/BasketCard/CartContext";
import TopSellersChart from './TopSellersChart';
import TopProductsChart from './TopProductsChart';
import TopClientsChart from './TopClientsChart';
import MonthlyProfitChart from './MonthlyProfitChart';
import MonthlyReportPDF from './MonthlyReportPDF';

const AuthorizedViewAnalizing = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.data_analysis) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <CartProvider>
        <Grid item xs={12}>
          <Grid sx={{ marginBottom: 2, padding: 2, marginTop: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t.data_analysis.title}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
              <MonthlyProfitChart/>
              <MonthlyReportPDF/>
              <TopSellersChart />
              <TopProductsChart />
              <TopClientsChart />
            </div>
          </Grid>
        </Grid>
      </CartProvider>
    </Grid>
  );
};

export default AuthorizedViewAnalizing;
