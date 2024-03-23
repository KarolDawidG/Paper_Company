import React, {useEffect, useState} from 'react';
import {Grid, Typography, Collapse, CardActions, CardContent, CardHeader, Card} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import axios from 'axios';
import {ProductCard} from './ProductCard';

export const ProductsCard = () => {
  const [data, setData] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setData(response.data.productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <Card sx={{ maxWidth: 999 }}>
      <CardHeader title="Produkty"/>

      <CardActions disableSpacing>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2} alignItems="stretch">
        <CardContent> 
          {data.map((product) => (
            <Grid item key={product.id} >
              <ProductCard product={product} />
            </Grid>
          ))}
        </CardContent>
        </Grid>
      </Collapse>
    </Card>
  );
}