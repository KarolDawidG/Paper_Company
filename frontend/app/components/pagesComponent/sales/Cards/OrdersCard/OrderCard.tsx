import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../utils/ExpandUtils/ExpandMore';
import OrderTable from './OrdersTable/OrderTable';
import useTranslation from "@/app/components/language/useTranslation";
import { LinearProgress } from '@mui/material';

export const OrderCard = () => {
  const [expanded, setExpanded] = useState(false);
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    if (!t.orders_card) {
      return <LinearProgress />;
    }

  return (
  <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title={`${t.orders_card.title}`}/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {t.orders_card.cart_contents}
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