import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Fade, Typography, Box, Divider, LinearProgress } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { modalStyle } from '../../SalesCard/ClientData/Modals/ModalStyles/modalStyle';
import { MainButton } from '@/app/components/layout/Buttons';
import useTranslation from "@/app/components/language/useTranslation";
import { notify } from '@/app/components/notification/Notify';

interface Product {
    product_name: string;
    quantity: number;
    price: number;
}

const OrderDetailsModal: React.FC<{ open: boolean; onClose: () => void; orderId: string; orderAdressId: string; clientId: string }> = ({ open, onClose, orderId, orderAdressId, clientId }) => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [addressData, setAddressData] = useState<any>();

    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/client/${orderAdressId}/${orderId}`);
            setAddressData(response.data.orderDetails.clientAddress);
            setProductsData(response.data.orderDetails.products);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [orderAdressId, orderId]);

    const totalPrice = productsData.reduce((sum, product) => sum + product.price * product.quantity, 0);
    
    const handleSave = async () => {
        try {
            await axiosInstance.post(`/client/save/${orderId}`, { addressId: orderAdressId, clientId: clientId });
            notify("Order details saved successfully!");
        } catch (error) {
            console.error("Error saving order details:", error);
            notify("Failed to save order details.");
        }
    };

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
                <Box sx={{ ...modalStyle, maxWidth: 800, width: "100%", padding: 4, borderRadius: 2, boxShadow: 5 }}>
                    <Typography variant="h6" id="order-details-modal-title" gutterBottom align="center">
                        {t.orders_card.order_detail}
                    </Typography>
                    
                    {/* Sekcja adresowa */}
                    <Box sx={{ marginBottom: 3 }}>
                        {addressData && (
                            <>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {t.orders_card.company_name}: {addressData[0].nazwa_firmy}
                                </Typography>
                                <Typography variant="body2">
                                    {t.orders_card.city}: {addressData[0].miasto}
                                </Typography>
                                <Typography variant="body2">
                                    {t.orders_card.postal_code}: {addressData[0].kod}
                                </Typography>
                                <Typography variant="body2">
                                    {t.orders_card.street}: {addressData[0].ulica}
                                </Typography>
                                <Typography variant="body2">
                                    {t.orders_card.address_no}: {addressData[0].nr_budynku}/{addressData[0].nr_mieszkania}
                                </Typography>
                            </>
                        )}
                    </Box>

                    <Divider sx={{ marginBottom: 3 }} />

                    {/* Sekcja produktów */}
                    <Box>
                        <Typography variant="h6" align="center" gutterBottom>{t.orders_card.products}</Typography>
                        <Box sx={{ maxHeight: 300, overflowY: 'auto', paddingRight: 1 }}>
                            {productsData && productsData.length > 0 ? (
                                productsData.map((product, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1, padding: 1 }}>
                                        <Typography variant="body1">{product.product_name}</Typography>
                                        <Typography variant="body1">{product.quantity} x {product.price.toFixed(2)} PLN</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" align="center">{t.orders_card.no_products}</Typography>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                        <Typography variant="h6">Łącznie:</Typography>
                        <Typography variant="h6">{totalPrice.toFixed(2)} PLN</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                        <MainButton onClick={handleSave}>
                            Zapisz
                        </MainButton>
                        <MainButton onClick={onClose}>
                            {t.orders_card.close}
                        </MainButton>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailsModal;
