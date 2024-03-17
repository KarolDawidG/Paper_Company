import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import axiosInstance from '@/app/api/axiosInstance';
import axios from 'axios';
import OrderTable from './OrdersTable /OrderTable';

export const CardSecond = () => {
  const [data, setData] = React.useState<any[]>([]);
  const [expanded, setExpanded] = React.useState(false);

  // React.useEffect(() => {

  //   const fetchData = async () => {
  //     const idUser:any = localStorage.getItem('idUser');
  //     try {
  //       const response = await axios.get('http://localhost:3001/sales', { params: { idUser } });
  //       setData(response.data.ordersList);
  //       //console.log(response.data.ordersList);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
 
  //   fetchData();
  // }, []);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
    <Card sx={{ maxWidth: 999 }}>
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
          <OrderTable/>
        </CardContent>
      </Collapse>
    </Card>
  );
}