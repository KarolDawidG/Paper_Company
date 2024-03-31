import * as React from 'react';
import { Typography, Grid, CardContent, CardMedia, Card, Button } from '@mui/material';
import {useState} from "react";
import {useCart} from "@/app/components/pagesComponent/sales/Cards/BasketCard/CartContext";

export const ProductCard = ({ id, name, description, price, stock }:any) => {
  const [clickCount, setClickCount] = useState(0);
    const { addToCart }:any = useCart();

  const handleAddToCart = (product:any) => {
      setClickCount(prevCount => prevCount + 1);
      addToCart(product)
  };

  return (
      <Card>
        <CardContent>
          <Grid container spacing={2}>

            <Grid item >
              <CardMedia component="img" height="120px" sx={{ width: '100%', margin: '0 auto' }} image="papier.jpg" alt="papier" />
            </Grid>

            <Grid item xs={12} sm={8} container direction="column">
              <Typography variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>

                <Grid container justifyContent="space-between" alignItems="center">

                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Cena: {price}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Ilosc: {stock}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Button onClick={() => handleAddToCart({ id, name, description, price, stock, clickCount })}>
                        Dodaj do koszyka
                      </Button>
                    </Grid>

                  </Grid>

                  <Typography variant="body2" color="text.secondary">
                    Razem za produkt: {(price * clickCount).toFixed(2)}
                  </Typography>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
  );
};
