import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import SalesCardLogic from "./SalesCardLogic";
import {AddDeliveryModal} from "@/app/components/pagesComponent/sales/Cards/SalesCard/AddDeliveryModal";
import {SelectClientsData} from "@/app/components/pagesComponent/sales/Cards/SalesCard/SelectClientsData";

export const CardOne = () => {
  const {
    handleExpandClick,
    expanded,
    formState: { errors } 
  } = SalesCardLogic();

  return (
      <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title="Sales" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Dane klienta.
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
          <AddDeliveryModal/>
        </CardContent>
      </Collapse>
    </Card>
  );
};
