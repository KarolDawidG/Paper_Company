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
    onSubmit,
    register,
    formState: { errors } 
  } = SalesCardLogic();

  return (
      <Card sx={{ maxWidth: '100%' }}>
      <CardHeader title="Adres dostawy" />
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box noValidate sx={{ mt: 1 }}>

              <Typography>
                Adres:
              </Typography>

              <TextField
                label="Miasto"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("miasto", { 
                  required: true, 
                  pattern: /^[a-zA-Z\s]{1,30}$/
              })}
                error={errors.miasto ? true : false}
                helperText={errors.miasto ? "Miasto jest wymagane" : ""}
                value={formData.miasto} 
                onChange={(e) => handleChange("miasto", e.target.value)}
                required
              />

              <TextField
                label="ulica"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("ulica", { required: true })}
                error={errors.ulica ? true : false}
                helperText={errors.ulica ? "Ulica jest wymagana" : ""}
                value={formData.ulica} 
                onChange={(e) => handleChange("ulica", e.target.value)}
                required
              />

              <TextField
                label="Nr budynku"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("nr_budynku", { required: true })}
                error={errors.nr_budynku ? true : false}
                helperText={errors.nr_budynku ? "Nr budynku jest wymagany" : ""}
                value={formData.nr_budynku} 
                onChange={(e) => handleChange("nr_budynku", e.target.value)}
                required
              />

              <TextField
                label="Nr mieszkania"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("nr_mieszkania", { required: true })}
                error={errors.nr_mieszkania ? true : false}
                helperText={errors.nr_mieszkania ? "Nr mieszkania jest wymagany" : ""}
                value={formData.nr_mieszkania} 
                onChange={(e) => handleChange("nr_mieszkania", e.target.value)}
                required
              />

              <TextField
                label="Kod pocztowy"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("kod", { 
                  required: true, 
                  pattern: /^\d{2}-\d{3}$/ })}
                error={errors.kod ? true : false}
                helperText={errors.kod ? "Kod pocztowy jest wymagany" : ""}
                value={formData.kod} 
                onChange={(e) => handleChange("kod", e.target.value)}
                required
              />

              <TextField
                label="Nazwa firmy"
                variant="outlined"
                margin="normal"
                size="small"
                {...register("nazwa_firmy", { required: true })}
                error={errors.nazwa_firmy ? true : false}
                helperText={errors.nazwa_firmy ? "Nazwa firmy jest wymagana" : ""}
                value={formData.nazwa_firmy} 
                onChange={(e) => handleChange("nazwa_firmy", e.target.value)}
                required
              />
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Zapisz adres
            </Button>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  );
};
