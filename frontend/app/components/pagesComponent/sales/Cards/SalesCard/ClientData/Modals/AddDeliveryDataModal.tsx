import React from "react";
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Modal, Fade, LinearProgress } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { modalStyle } from "./ModalStyles/modalStyle";
import { MainButton } from "@/app/components/layout/Buttons";
import useTranslation from "@/app/components/language/useTranslation";
import useTranslationStatus from "@/app/components/language/useTranslationStatus";

type FieldKeys = 'city' | 'street' | 'building' | 'no_apartment' | 'code' | 'company_name';

type FormData = {
    [key in FieldKeys]: string;
};

export const AddDeliveryDataModal: React.FC<{ open: boolean; onClose: () => void, fetchAddressData: () => void}> = ({ open, onClose, fetchAddressData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);
  
    const onSubmit = async (data: FormData) => {
        const client_id = sessionStorage.getItem('clientId');
        if (!client_id) {
            if (isTranslationLoaded) {
                notify(`${t.notification.choose_client}`);
                return;
            }
        }
        try {
            const orderData = { ...data, client_id };
            const response = await axiosInstance.post('/sales', orderData, {
                headers: { 'Content-Type': 'application/json' }
            });
            localStorage.setItem("order_id", response.data.order_id);
            if (isTranslationLoaded) {
                notify(`${t.notification.addres_added}`);
                return;
            }
            fetchAddressData();
            reset();
            onClose();
        } catch (error) {
            console.error('Request failed:', error);
            if (isTranslationLoaded) {
                notify(`${t.notification.error}`);
                return;
            }
        }
    };

    if (!t.notification) {
        return <LinearProgress />;
      }

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography sx={{ mt: 1 }}>
                            {t.notification.new_addres_question}
                        </Typography>
                        {(["city", "street", "building", "no_apartment", "code", "company_name"] as FieldKeys[]).map(field => (
                            <TextField
                                key={field}
                                label={t.address[field]}
                                variant="outlined"
                                margin="normal"
                                size="small"
                                fullWidth
                                {...register(field, {
                                    required: `${t.address[field]} ${t.address.is_required}`,
                                    pattern: field === "code" ? /^\d{2}-\d{3}$/ : undefined
                                })}
                                error={Boolean(errors[field])}
                                helperText={errors[field]?.message || ''}
                            />
                        ))}

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
