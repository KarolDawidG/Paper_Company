import React from "react";
import { Typography, LinearProgress, Collapse, Card, CardHeader, CardContent, CardActions, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../../utils/ExpandUtils/ExpandMore';
import useTranslation from "@/app/components/language/useTranslation";
import SalesCardLogic from "../../../sales/Cards/SalesCard/SalesCardLogic";
import InvoicesPage from "./InvoicesPage";

export const FirstCard = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const { handleExpandClick, expanded, formState: { errors } } = SalesCardLogic();

  if (!t.accounting) {
    return <LinearProgress />;
  }

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardContent>
        <Typography variant="body2"  sx={{ pl: 1, fontSize: '1.5rem'}}>
          {'Lista faktur'}
        </Typography>
      </CardContent>

      <CardActions disableSpacing sx={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 2, paddingRight: 2 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem>
            <ListItemText
              primary={'Lista faktur zapisaych w systemie'}
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
          <InvoicesPage/>
        </CardContent>
      </Collapse>
    </Card>
  );
};
