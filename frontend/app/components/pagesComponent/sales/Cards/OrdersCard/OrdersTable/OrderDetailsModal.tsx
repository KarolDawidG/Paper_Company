import React, { useEffect, useState } from 'react';
import {Modal, Backdrop, Fade, Typography, Box, Button} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { modalStyle } from '../../SalesCard/ClientData/Modals/ModalStyles/modalStyle';
import { MainButton } from '@/app/components/layout/Buttons';

const OrderDetailsModal: React.FC<{ open: boolean; onClose: () => void; order: string  }> = ({open, onClose, order,}) => {
    const [data, setData] = useState<any>();

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
                        Szczegóły zamówienia
                    </Typography>
                    <Box>
                        {data && (
                            <>
                                <Typography variant="subtitle1">
                                    Nazwa firmy: {data[0].nazwa_firmy}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Miasto: {data[0].miasto}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Kod: {data[0].kod}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ulica: {data[0].ulica}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Nr budynku/mieszkania: {data[0].nr_budynku}/{data[0].nr_mieszkania}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <MainButton onClick={onClose} >
                            Close
                        </MainButton>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailsModal;
