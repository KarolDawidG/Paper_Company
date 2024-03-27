import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import OrderTable from './OrdersTable/OrderTable';
import {Button, Grid} from "@mui/material";
import ClientList from "@/app/components/pagesComponent/sales/Cards/OrdersCard/ClientList/ClientList";

export const CardSecond = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
  <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title="Zamowienia"/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Obsluga zamowien
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
         <ClientList/>
         <OrderTable/>
        </CardContent>
      </Collapse>
  </Card>
  );
}