import * as React from 'react';
import { Typography, Grid, CardContent, CardMedia, Card } from '@mui/material';

export const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card sx={{ maxWidth: '100%' }}>
      <Grid container spacing={1}>
        <Grid >
          <CardMedia component="img" height="100px" sx={{ width: '100%', margin: '0 auto'  }}  image="papier.jpg" alt="papier" />
        </Grid>
        <Grid >
          <CardContent>
            <Typography variant="h5" component="div">
              {product.productsData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.productsData.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cena: {product.productsData.price}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};
