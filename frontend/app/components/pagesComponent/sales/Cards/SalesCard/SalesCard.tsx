import React from "react";
import { Typography, LinearProgress, Collapse, Card, CardHeader, CardContent, CardActions, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../../utils/ExpandUtils/ExpandMore';
import SalesCardLogic from "./SalesCardLogic";
import SelectClientsData from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/SelectClientsData";
import useTranslation from "@/app/components/language/useTranslation";

export const SalesCard = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const { handleExpandClick, expanded, formState: { errors } } = SalesCardLogic();

  if (!t.sales_and_orders) {
    return <LinearProgress />;
  }

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title={t.sales_and_orders.card_sales_title} />
      <CardContent>
        <Typography variant="body2"  sx={{ pl: 1, fontSize: '1.5rem'}}>
          {t.sales_and_orders?.mainInfo}
        </Typography>
      </CardContent>

      <CardActions disableSpacing sx={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 2, paddingRight: 2 }}>
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          subheader={
            <ListSubheader component="div" sx={{ bgcolor: 'inherit', pl: 1, fontSize: '1.4rem'}}>
              {t.sales_and_orders.order_explementation}
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemText
              primary={t.sales_and_orders.step_1}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={t.sales_and_orders.step_2}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={t.sales_and_orders.step_3}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={t.sales_and_orders.step_4}
            />
          </ListItem>
        </List>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ alignSelf: 'center' }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <SelectClientsData />
        </CardContent>
      </Collapse>
    </Card>
  );
};
