import React, {useEffect, useState} from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Box,
    Button,
} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import {notify} from "@/app/components/notification/Notify";
import { useForm } from 'react-hook-form';
import TextField from "@mui/material/TextField";

const AddClientModal: React.FC<{ open: boolean; onClose: () => void }> = ({open, onClose}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [clientData, setClientData] = useState({
        email: "",
        first_name: "",
        second_name: "",
    });

    const onSubmit = async(data: Record<string, any>) => {
        try {
            const response = await axiosInstance.post('/client', clientData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            notify(response.data);
            reset();
        } catch (error) {
            console.error('Request failed:', error);
            notify("Nie udalo sie przekazac danych");
        }
    };

    const handleChange = (field:any, value:any) => {
        setClientData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="order-details-modal-title" aria-describedby="order-details-modal-description" closeAfterTransition slots={{backdrop: Backdrop,}} slotProps={{backdrop: {timeout: 500,},}}>
            <Fade in={open}>
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '400px', maxWidth: '80vw', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px',}}>
                    <Typography variant="h6" id="order-details-modal-title" gutterBottom>
                        Dodawanie klienta
                    </Typography>
                    <Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("email", { required: true })}
                                error={errors.email ? true : false}
                                helperText={errors.email ? "Email jest wymagany" : ""}
                                value={clientData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                required
                            />

                            <TextField
                                label="First name"
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("first_name", { required: true })}
                                error={errors.first_name ? true : false}
                                helperText={errors.first_name ? "First name is required" : ""}
                                value={clientData.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                required
                            />

                            <TextField
                                label="Second name"
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("second_name", { required: true })}
                                error={errors.second_name ? true : false}
                                helperText={errors.second_name ? "Second name is required" : ""}
                                value={clientData.second_name}
                                onChange={(e) => handleChange("second_name", e.target.value)}
                                required
                            />

                            <Button sx={{ mt: 2, marginLeft: 4 }} type="submit" variant="contained" color="primary">
                                Zapisz adres
                            </Button>
                        </form>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={onClose} variant="outlined" color="primary">
                            Zamknij
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddClientModal;
