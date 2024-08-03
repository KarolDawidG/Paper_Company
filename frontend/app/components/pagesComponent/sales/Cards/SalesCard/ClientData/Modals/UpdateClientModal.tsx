import React, {useEffect, useState} from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Box,
    Button,
    LinearProgress,
} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import {notify} from "@/app/components/notification/Notify";
import { useForm } from 'react-hook-form';
import TextField from "@mui/material/TextField";
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';

const UpdateClientModal: React.FC<{ open: boolean; onClose: () => void; updateData:any, fetchData:any }> = ({open, onClose, updateData, fetchData}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);
  
    const [clientData, setClientData] = useState({
        id: updateData.id,
        email: updateData.email,
        first_name: updateData.first_name,
        second_name: updateData.second_name,
    });

    const onSubmit = async(data: Record<string, any>) => {
        try {
            const response = await axiosInstance.put(`client/${clientData.id}`, clientData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (isTranslationLoaded) {
                notify(`${t.notification.correct}`);
                return;
            }
            reset();
            fetchData();
            onClose();
        } catch (error) {
            console.error('Request failed:', error);
            if (isTranslationLoaded) {
                notify(`${t.notification.error}`);
                return;
            }
        }
    };

    const handleChange = (field:any, value:any) => {
        setClientData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    if (!t.notification) {
        return <LinearProgress />;
      }
      
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="order-details-modal-title" aria-describedby="order-details-modal-description" closeAfterTransition slots={{backdrop: Backdrop,}} slotProps={{backdrop: {timeout: 500,},}}>
            <Fade in={open}>
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '400px', maxWidth: '80vw', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px',}}>
                    <Typography variant="h6" id="order-details-modal-title" gutterBottom>
                        {t.notification.cliend_data_change}
                    </Typography>
                    <Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label={t.notification.email}
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("email", { required: true })}
                                error={errors.email ? true : false}
                                helperText={errors.email ? `${t.notification.email_require}` : ""}
                                value={clientData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                required
                            />

                            <TextField
                                label={t.notification.name}
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("first_name", { required: true })}
                                error={errors.first_name ? true : false}
                                helperText={errors.first_name ? `${t.notification.name_require}` : ""}
                                value={clientData.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                required
                            />

                            <TextField
                                label={t.notification.second_name}
                                variant="outlined"
                                margin="normal"
                                size="small"
                                {...register("second_name", { required: true })}
                                error={errors.second_name ? true : false}
                                helperText={errors.second_name ? `${t.notification.second_require}` : ""}
                                value={clientData.second_name}
                                onChange={(e) => handleChange("second_name", e.target.value)}
                                required
                            />

                            <Button sx={{ mt: 2, marginLeft: 4 }} type="submit" variant="contained" color="primary">
                                {t.notification.save}
                            </Button>
                        </form>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={onClose} variant="outlined" color="primary">
                            {t.notification.close}
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default UpdateClientModal;
