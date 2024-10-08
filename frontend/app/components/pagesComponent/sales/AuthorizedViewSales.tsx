import React from 'react';
import useTranslation from "../../language/useTranslation";
import { Grid, Typography, LinearProgress } from '@mui/material';
import { SalesCard } from './Cards/SalesCard/SalesCard';
import { OrderCard } from './Cards/OrdersCard/OrderCard';
import { BasketCard } from './Cards/BasketCard/BasketCard';
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
              <SalesCard/>
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <ProductsCard />
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <BasketCard />
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <OrderCard />
            </Grid>

          </Grid>
        </Grid>
      </CartProvider>
    </Grid>
  );
};

export default AuthorizedViewSales;
