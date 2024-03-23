import React from 'react';
import useTranslation from "../../language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";
import { Grid, Typography, Divider } from '@mui/material';
import { CardOne } from './Cards/SalesCard/SalesCard';
import { CardSecond } from './Cards/OrdersCard/CardSecond';
import { CardThird } from './Cards/BasketCard/BasketCard';
import { ProductsCard } from './Cards/ProductsCard/ProductsCard';
import {CartProvider} from "@/app/components/pagesComponent/sales/Cards/BasketCard/CartContext";

const AuthorizedViewSales = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.security) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <CartProvider>
        <Grid item xs={12}>
          <Grid sx={{ marginBottom: 2, padding: 2, marginTop:2 }}>

            <Typography variant="h4" align="center" gutterBottom>
              {t.sales_and_orders.title}
            </Typography>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <CardOne/>
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <CardSecond />
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <ProductsCard />
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <CardThird />
            </Grid>

          </Grid>
        </Grid>
      </CartProvider>
    </Grid>
  );
};

export default AuthorizedViewSales;
