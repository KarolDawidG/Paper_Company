import React from 'react';
import useTranslation from "../../language/useTranslation";
import { Grid, Typography, LinearProgress } from '@mui/material';
import {CartProvider} from "@/app/components/pagesComponent/sales/Cards/BasketCard/CartContext";
import { EmployeeProfiles } from './Cards/EmployeeProfilesComponent/EmployeeProfiles';
import { SendMessageToEmployee } from './Cards/SendMessageComponent/SendMessageToEmployee';
import { MailBox } from './Cards/MailBoxComponent/MailBox';

const AuthorizedViewHR = () => {
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
              {t.human_resources.title}
            </Typography>
              <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                <EmployeeProfiles />  
              </Grid>
              <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                <SendMessageToEmployee />
              </Grid>
              <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                <MailBox />
              </Grid>
          </Grid>
        </Grid>
      </CartProvider>
    </Grid>
  );
};

export default AuthorizedViewHR;
