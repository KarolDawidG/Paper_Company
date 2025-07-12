import React from 'react';
import useTranslation from "../../language/useTranslation";
import { Grid, Typography, LinearProgress } from '@mui/material';
import {CartProvider} from "@/app/components/pagesComponent/sales/Cards/BasketCard/CartContext";
import { FirstCard } from './Cards/FirstCard/FirstCard';
import { SecondCard } from './Cards/SecondCard/SecondCard';

const AuthorizedViewAccounting = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.accounting ) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <CartProvider>
        <Grid item xs={12}>
          <Grid sx={{ marginBottom: 2, padding: 2, marginTop:2 }}>

            <Typography variant="h4" align="center" gutterBottom>
              {t.accounting.title}
            </Typography>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <FirstCard/>
            </Grid>

            <Grid sx={{ marginBottom: 2, marginTop:2 }}>
              <SecondCard />
            </Grid>

          </Grid>
        </Grid>
      </CartProvider>
    </Grid>
  );
};

export default AuthorizedViewAccounting;
