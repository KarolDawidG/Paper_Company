import React from "react";
import { useForm, FieldValues, UseFormRegister } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Modal, Fade } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { modalStyle } from "./modalStyle";

type FieldKeys = 'miasto' | 'ulica' | 'nr_budynku' | 'nr_mieszkania' | 'kod' | 'nazwa_firmy';

type FormData = {
    [key in FieldKeys]: string;
};

export const AddDeliveryDataModal: React.FC<{ open: boolean; onClose: () => void, fetchAddressData: () => void}> = ({ open, onClose, fetchAddressData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        const client_id = sessionStorage.getItem('clientId');
        if (!client_id) {
            notify("Najpierw wybierz klienta!");
            return;
        }
        try {
            const orderData = { ...data, client_id };
            const response = await axiosInstance.post('/sales', orderData, {
                headers: { 'Content-Type': 'application/json' }
            });
            localStorage.setItem("order_id", response.data.order_id);
            notify("Nowy adres dostawy został zapisany!");
            fetchAddressData();
            reset();
            onClose();
        } catch (error) {
            console.error('Request failed:', error);
            notify("Nie udało się przekazać danych!");
        }
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography sx={{ mt: 1 }}>
                            Do you want to add new address to selected clients?
                        </Typography>
                        {(["miasto", "ulica", "nr_budynku", "nr_mieszkania", "kod", "nazwa_firmy"] as FieldKeys[]).map(field => (
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
                                error={Boolean(errors[field])}
                                helperText={errors[field]?.message || ''}
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
