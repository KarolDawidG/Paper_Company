import React from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import SalesCardLogic from "./SalesCardLogic";

export const AddDeliveryModal = () => {
    const {
        handleSubmit,
        handleChange,
        formData,
        onSubmit,
        register,
        formState: { errors }
    } = SalesCardLogic();

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box  sx={{ mt: 1 }}>
                    <Typography>
                        Do you want to add new Adres to selected clients?
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
                                error={!!errors.miasto}
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
                                error={!!errors.ulica}
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
                                error={!!errors.nr_budynku}
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
                                error={!!errors.nr_mieszkania}
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
                                error={!!errors.kod}
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
                                error={!!errors.nazwa_firmy}
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
        </Box>
    );
};
