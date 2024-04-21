import React from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Modal, Fade } from '@mui/material';
import SalesCardLogic from "../../SalesCardLogic";
import { modalStyle } from "./modalStyle";

export const AddDeliveryDataModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const {
        handleSubmit,
        handleChange,
        formData,
        onSubmit,
        register,
        formState: { errors }
    } = SalesCardLogic();

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography sx={{ mt: 1 }}>
                            Do you want to add new address to selected clients?
                        </Typography>
                        {["miasto", "ulica", "nr_budynku", "nr_mieszkania", "kod", "nazwa_firmy"].map(field => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}
                                variant="outlined"
                                margin="normal"
                                size="small"
                                fullWidth
                                {...register(field, {
                                    required: `${field.replace(/_/g, ' ')} jest wymagane`,
                                    pattern: field === "kod" ? /^\d{2}-\d{3}$/ : undefined
                                })}
                                error={!!errors[field]}
                                helperText={errors[field]?.message?.toString() || ''}
                                value={formData[field]}
                                onChange={e => handleChange(field, e.target.value)}
                                required
                            />
                        ))}
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Save the data
                        </Button>
                        <Button onClick={onClose} variant="outlined" color="primary" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};
