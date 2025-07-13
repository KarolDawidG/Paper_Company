import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Fade, Typography, Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { MainButton } from '@/app/components/layout/Buttons';
import useTranslation from "@/app/components/language/useTranslation";
import { notify } from '@/app/components/notification/Notify';
import { modalStyle } from '../../../sales/Cards/SalesCard/ClientData/Modals/ModalStyles/modalStyle';
import { OrderDetail } from './interfaces/invoice';

const OrderDetailsModal: React.FC<{orderId: string; open: boolean; onClose: () => void}> = ({ orderId, open, onClose }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[] | null>(null);
  const [loading, setLoading] = useState(false);

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/invoice/details/${orderId}`);
      setOrderDetails(response.data.details);
    } catch (error) {
      console.error('Error fetching data:', error);
      notify("Błąd pobierania szczegółów zamówienia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const client = orderDetails?.[0];
  const total = orderDetails?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

    if (!t.orders_card) {
      return <LinearProgress />;
    }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOrderDetails(null);
        onClose();
      }}
      aria-labelledby="order-details-modal-title"
      aria-describedby="order-details-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={{ ...modalStyle, maxWidth: 1000, width: "100%", p: 4, borderRadius: 2, boxShadow: 5 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {t.orders_card.order_detail}
          </Typography>

          {loading ? (
            <LinearProgress />
          ) : orderDetails && client ? (
            <>
              {/* Klient i zamówienie */}
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", mb: 2 }}>
                <Box sx={{ flex: "1 1 48%", mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>📄 Informacje o zamówieniu</Typography>
                  <Typography><strong>Numer zamówienia:</strong> {client.order_id}</Typography>
                  <Typography><strong>Data utworzenia:</strong> {new Date(client.created_at).toLocaleDateString()}</Typography>
                  <Typography><strong>Status:</strong> {client.status}</Typography>
                  <Typography><strong>Status płatności:</strong> {client.payment_status}</Typography>
                  {client.payment_date && (
                    <Typography><strong>Data płatności:</strong> {new Date(client.payment_date).toLocaleDateString()}</Typography>
                  )}
                </Box>

                <Box sx={{ flex: "1 1 48%", mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>🏢 Klient</Typography>
                  <Typography><strong>{client.company_name}</strong></Typography>
                  <Typography>{client.first_name} {client.second_name}</Typography>
                  <Typography>{client.email}</Typography>
                  <Typography>{client.ulica} {client.nr_budynku}{client.nr_mieszkania ? `/${client.nr_mieszkania}` : ""}</Typography>
                  <Typography>{client.kod} {client.miasto}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Produkty */}
              <Typography variant="subtitle1" gutterBottom>🧾 Lista produktów</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Produkt</strong></TableCell>
                      <TableCell><strong>Ilość</strong></TableCell>
                      <TableCell><strong>Cena jedn. (zł)</strong></TableCell>
                      <TableCell><strong>Wartość (zł)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.translated_name ?? item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toFixed(2)}</TableCell>
                        <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Suma */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Typography variant="h6">
                  💰 Suma brutto: {total.toFixed(2)} zł
                </Typography>
              </Box>
            </>
          ) : (
            <Typography align="center" mt={2}>Brak danych do wyświetlenia.</Typography>
          )}

          {/* Przycisk */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <MainButton onClick={onClose}>{t.orders_card.close}</MainButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderDetailsModal;
