import React, { useEffect, useState } from 'react';
import {Modal, Backdrop, Fade, Typography, Box, LinearProgress} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { modalStyle } from '../../SalesCard/ClientData/Modals/ModalStyles/modalStyle';
import { MainButton } from '@/app/components/layout/Buttons';
import useTranslation from "@/app/components/language/useTranslation";

const OrderDetailsModal: React.FC<{ open: boolean; onClose: () => void; order: string  }> = ({open, onClose, order,}) => {
    const [data, setData] = useState<any>();
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/client/${order}`);
            setData(response.data.clientAddress);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [order]);

    if (!t.orders_card) {
        return <LinearProgress />;
      }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="order-details-modal-title"
            aria-describedby="order-details-modal-description"
            closeAfterTransition
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" id="order-details-modal-title" gutterBottom>
                        {t.orders_card.order_detail}
                    </Typography>
                    <Box>
                        {data && (
                            <>
                                <Typography variant="subtitle1">
                                {t.orders_card.company_name}: {data[0].nazwa_firmy}
                                </Typography>
                                <Typography variant="subtitle1">
                                {t.orders_card.city}: {data[0].miasto}
                                </Typography>
                                <Typography variant="subtitle1">
                                {t.orders_card.postal_code}: {data[0].kod}
                                </Typography>
                                <Typography variant="subtitle1">
                                {t.orders_card.street}: {data[0].ulica}
                                </Typography>
                                <Typography variant="subtitle1">
                                {t.orders_card.address_no}: {data[0].nr_budynku}/{data[0].nr_mieszkania}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <MainButton onClick={onClose} >
                            {t.orders_card.close}
                        </MainButton>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailsModal;
