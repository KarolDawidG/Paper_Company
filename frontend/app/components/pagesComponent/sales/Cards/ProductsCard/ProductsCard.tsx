import React, {useEffect, useState} from 'react';
import {Grid, Typography, Collapse, CardActions, CardContent, CardHeader, Card} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../utils/ExpandUtils/ExpandMore';
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
      <Card sx={{ maxWidth: '100%' }}>
        <CardHeader title="Produkty"/>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Obsluga produktow
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {data.map((product) => (
            <Grid item key={product.id} >
              <ProductCard
                  id={product.productsData.id}
                  name={product.productsData.name}
                  description={product.productsData.description}
                  price={product.productsData.price}
                  stock={product.productsData.stock}
              />
            </Grid>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}