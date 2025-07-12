import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Fade, Typography, Box, LinearProgress } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { MainButton } from '@/app/components/layout/Buttons';
import useTranslation from "@/app/components/language/useTranslation";
import { notify } from '@/app/components/notification/Notify';
import { modalStyle } from '../../../sales/Cards/SalesCard/ClientData/Modals/ModalStyles/modalStyle';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { GeneratorPDF } from './GeneratorPDF';
import { Product } from './Interface/ProductInterface';


const PdfDetailsModal: React.FC<{open: boolean; onClose: () => void; orderId: string; orderAdressId: string; clientId: string; }> = ({ open, onClose, orderId, orderAdressId, clientId }) => {
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
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={{ ...modalStyle, maxWidth: 1000, width: "100%", padding: 4, borderRadius: 2, boxShadow: 5 }}>
          <Typography variant="h6" id="order-details-modal-title" gutterBottom align="center">
            {t.orders_card.order_detail}
          </Typography>

          {productsData.length > 0 && addressData && (
            <>
              <PDFViewer style={{ width: '100%', height: '600px', marginTop: '20px' }}>
                <GeneratorPDF items={productsData} address={addressData[0]} total={totalPrice} />
              </PDFViewer>

              <Box sx={{ marginTop: 3 }}>
                <PDFDownloadLink
                  document={<GeneratorPDF items={productsData} address={addressData[0]} total={totalPrice} />}
                  fileName={`zamowienie_${orderId}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <MainButton>Generowanie PDF..</MainButton>
                    ) : (
                      <MainButton>Pobierz PDF</MainButton>
                    )
                  }
                </PDFDownloadLink>
              </Box>
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <MainButton onClick={onClose}>{t.orders_card.close}</MainButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PdfDetailsModal;
