import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from './ExpandMore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

export const CardOne = () => {
  const [expanded, setExpanded] = useState(false);
  const [ilosc, setIlosc] = useState<number | any>();
  const [email, setEmail] = useState<string>();
  const [imie, setImie] = useState<string>();
  const [produkt, setProdukt] = useState<string>();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = {
      imie,
      email,
      produkt,
      ilosc,
    };
    console.log(formData);
  };
  
  return (
    <Card sx={{ maxWidth: 999 }}>
      <CardHeader title="Przyjmowanie zamówień" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Kontakt z klientem w celu składania zamówień.
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
          <form onSubmit={handleSubmit}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                label="Imię klienta"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => setImie(e.target.value)}
                required
              />

              <TextField
                label="Adres e-mail"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />

              <TextField
                label="Produkt"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => setProdukt(e.target.value)}
                required
              />

              <TextField
                label="Ilość"
                variant="outlined"
                margin="normal"
                size="small"
                type="number"
                onChange={(e) => setIlosc(e.target.value)}
                required
              />
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Złóż zamówienie
            </Button>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  );
};
