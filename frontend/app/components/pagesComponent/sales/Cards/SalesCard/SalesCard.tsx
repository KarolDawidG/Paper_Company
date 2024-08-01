import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../utils/ExpandUtils/ExpandMore';
import SalesCardLogic from "./SalesCardLogic";
import SelectClientsData from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/SelectClientsData";
import useTranslation from "@/app/components/language/useTranslation";
import { LinearProgress } from "@mui/material";

export const CardOne = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const {handleExpandClick, expanded, formState: { errors }} = SalesCardLogic();

  if (!t.sales_and_orders) {
    return <LinearProgress />;
  }
  
  return (
      <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title={`${t.sales_and_orders.card_sales_title}`} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {t.sales_and_orders?.mainInfo}
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
          <SelectClientsData/>
        </CardContent>
      </Collapse>
    </Card>
  );
};
