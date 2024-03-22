import React, {useEffect, useState} from 'react';
import {Grid, Typography, Collapse, CardActions, CardContent, CardHeader, Card} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import axios from 'axios';

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

        console.log('products');
        console.log(response.data.productsData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, []);


  return (
    <Card sx={{ maxWidth: 999 }}>
      <CardHeader title="Produkty"/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Produkty
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
        <Grid container spacing={2}>
        <CardContent>
          <Typography paragraph>
              {data.map(product => (
                <Grid key={product.productsData.id} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.productsData.name}
                      </Typography>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.productsData.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Typography>
        </CardContent>
        </Grid>
      </Collapse>
    </Card>
  );
}