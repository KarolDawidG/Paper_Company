import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import SalesCardLogic from "./SalesCardLogic";

export const CardOne = () => {

  const {
    handleExpandClick,
    handleSubmit,
    handleChange,
    formData,
    expanded,
  } = SalesCardLogic();

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
                onChange={(e) => handleChange("imie", e.target.value)}
                required
              />

              <TextField
                label="Adres e-mail"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("email", e.target.value)}
                required
                type="email"
              />

              <TextField
                label="Produkt"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("produkt", e.target.value)}
                required
              />

              <TextField
                label="Ilość"
                variant="outlined"
                margin="normal"
                size="small"
                type="number"
                onChange={(e) => handleChange("ilosc", e.target.value)}
                required
              />

              <Typography>
                Adres:
              </Typography>

              <TextField
                label="Miasto"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("miasto", e.target.value)}
                required
              />

              <TextField
                label="ulica"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("ulica", e.target.value)}
                required
              />

              <TextField
                label="Nr budynku"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("nr_budynku", e.target.value)}
                required
              />

              <TextField
                label="Nr mieszkania"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("nr_mieszkania", e.target.value)}
                required
              />

              <TextField
                label="Kod pocztowy"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("kod", e.target.value)}
                required
              />

              <TextField
                label="Nazwa firmy"
                variant="outlined"
                margin="normal"
                size="small"
                onChange={(e) => handleChange("nazwa_frimy", e.target.value)}
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
