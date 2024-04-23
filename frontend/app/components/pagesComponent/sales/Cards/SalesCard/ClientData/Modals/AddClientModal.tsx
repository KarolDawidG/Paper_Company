import React from 'react';
import { Modal, Fade, Typography, Box, TextField} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useForm } from 'react-hook-form';
import { modalStyle } from './ModalStyles/modalStyle';
import { MainButton } from '@/app/components/layout/Buttons';

const AddClientModal: React.FC<{ open: boolean; onClose: () => void, fetchData: () => void }> = ({ open, onClose, fetchData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            email: "",
            first_name: "",
            second_name: "",
        }
    });

    const onSubmit = async (data:any) => {
        try {
            const response = await axiosInstance.post('/client', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            notify(response.data);
            fetchData(); 
            reset();
            onClose();
        } catch (error) {
            console.error('Request failed:', error);
            notify("Nie udało się przekazać danych");
        }
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition aria-labelledby="modal-title" aria-describedby="modal-description">
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        Dodawanie klienta
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("email", { required: "Email jest wymagany" })}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            label="Imię"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("first_name", { required: "Imię jest wymagane" })}
                            error={Boolean(errors.first_name)}
                            helperText={errors.first_name?.message}
                        />
                        <TextField
                            label="Nazwisko"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("second_name", { required: "Nazwisko jest wymagane" })}
                            error={Boolean(errors.second_name)}
                            helperText={errors.second_name?.message}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                            <MainButton type="submit">
                                Save
                            </MainButton>

                            <MainButton onClick={onClose}>
                                Close
                            </MainButton>
                        </Box>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddClientModal;
