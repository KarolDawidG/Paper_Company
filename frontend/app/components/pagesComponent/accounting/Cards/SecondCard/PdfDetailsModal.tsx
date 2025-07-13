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
import { pdf } from '@react-pdf/renderer';

const PdfDetailsModal: React.FC<{onSuccess: () => void; open: boolean; onClose: () => void; orderId: string; orderAdressId: string; clientId: string; }> = ({ onSuccess, open, onClose, orderId, orderAdressId, clientId }) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [addressData, setAddressData] = useState<any>();
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const [signedMap, setSignedMap] = useState<Record<string, boolean>>({});

const handleSendToBackend = async () => {
  try {
    if (!productsData.length || !addressData) return;

    const doc = (
      <GeneratorPDF
        items={productsData}
        address={addressData[0]}
        total={totalPrice}
        clientId={clientId}
        orderId={orderId}
        signed={true}
      />
    );

    const blob = await pdf(doc).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = Array.from(new Uint8Array(arrayBuffer));

    await axiosInstance.post("/invoice", {
      pdf: uint8Array,
      clientId,
      clientAddressId: orderAdressId,
      orderId,
    });
      notify("Faktura została wysłana do klienta.");
      onSuccess();
      onClose();
  } catch (err) {
    console.error("Błąd przy wysyłaniu faktury:", err);
    notify("Błąd przy wysyłaniu faktury.");
  }
};


const handleSignAndSend = () => {
  if (!productsData.length || !addressData) return;

  setSignedMap(prev => ({ ...prev, [orderId]: true }));
  notify("Faktura została podpisana.");
};



  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/client/${orderAdressId}/${orderId}`);
      setAddressData(response.data.orderDetails.clientAddress);
      setProductsData(response.data.orderDetails.products);
      
      console.log(response.data.orderDetails.clientAddress);
      console.log(response.data.orderDetails.products);

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
                <GeneratorPDF signed={signedMap[orderId]} items={productsData} address={addressData[0]} total={totalPrice} clientId={''} orderId={''} />
              </PDFViewer>
                <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
                  <MainButton onClick={handleSignAndSend}>
                    {t.orders_card.sign_and_send || 'Podpisz'}
                  </MainButton>
                </Box>
                  {signedMap[orderId] && (
                    <MainButton
                      onClick={handleSendToBackend}
                      sx={{ ml: 2 }}
                    >
                      Wyślij do klienta
                    </MainButton>
                  )}
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
