import React from 'react';
import { Modal, Fade, Typography, Box, TextField, LinearProgress} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useForm } from 'react-hook-form';
import { modalStyle } from './ModalStyles/modalStyle';
import { MainButton } from '@/app/components/layout/Buttons';
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';

const AddClientModal: React.FC<{ open: boolean; onClose: () => void, fetchData: () => void }> = ({ open, onClose, fetchData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            email: "",
            first_name: "",
            second_name: "",
            company_name: "",
        }
    });
    
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);
  
    const onSubmit = async (data:any) => {
        try {
            console.log(data);
            const response = await axiosInstance.post('/client', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (isTranslationLoaded) {
                notify(`${t.notification.added_client}`);
                return;
            }
            
            reset();
            onClose();
            fetchData(); 
        } catch (error) {
            console.error('Request failed:', error);
                if (isTranslationLoaded) {
                    notify(`${t.notification.error_data}`);
                    return;
                }
        }
    };

    if (!t.notification) {
        return <LinearProgress />;
      }

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition aria-labelledby="modal-title" aria-describedby="modal-description">
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        {t.notification.add_client}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label={t.notification.email}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("email", { required: `${t.notification.email_require}` })}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            label={t.notification.name}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("first_name", { required: `${t.notification.name_require}` })}
                            error={Boolean(errors.first_name)}
                            helperText={errors.first_name?.message}
                        />
                        <TextField
                            label={t.notification.second_name}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("second_name", { required: `${t.notification.second_require}`  })}
                            error={Boolean(errors.second_name)}
                            helperText={errors.second_name?.message}
                        />
                        <TextField
                            label="Company Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("company_name", { required: `${t.notification.second_require}  `  })}
                            error={Boolean(errors.company_name)}
                            helperText={errors.company_name?.message}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                            <MainButton type="submit">
                                {t.notification.save}
                            </MainButton>

                            <MainButton onClick={onClose}>
                                {t.notification.close}
                            </MainButton>
                        </Box>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddClientModal;
