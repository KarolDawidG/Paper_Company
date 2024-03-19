import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { formatDate } from '@/app/components/helpers/formDate';

const OrderDetailsModal: React.FC<{ open: boolean; onClose: () => void; order: any }> = ({
  open,
  onClose,
  order,
}) => {

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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: '400px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" id="order-details-modal-title" gutterBottom>
            Szczegóły zamówienia
          </Typography>
          <Box>
            <Typography variant="subtitle1">
              Imię: {order.orderData.imie}
            </Typography>
            <Typography variant="subtitle1">
              Nazwa firmy: {order.orderData.nazwa_firmy}
            </Typography>
            <Typography variant="subtitle1">
              Produkt: {order.orderData.produkt}
            </Typography>
            <Typography variant="subtitle1">
              Data zamówienia: {formatDate(order.orderData.created_at)}
            </Typography>
            <Typography variant="subtitle1">
                Ilosc: {order.orderData.ilosc}
            </Typography>
            <Typography variant="h5" id="order-details-modal-title" gutterBottom>
                Adres:
            </Typography>
            <Typography variant="subtitle1">
                Miasto: {order.orderData.miasto}
            </Typography>
            <Typography variant="subtitle1">
                Kod: {order.orderData.kod}
            </Typography>
            <Typography variant="subtitle1">
                Ulica: {order.orderData.ulica}
            </Typography>
            <Typography variant="subtitle1">
                Nr budynku/mieszkania: {order.orderData.nr_budynku}/{order.orderData.nr_mieszkania}
            </Typography>
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

export default OrderDetailsModal;
