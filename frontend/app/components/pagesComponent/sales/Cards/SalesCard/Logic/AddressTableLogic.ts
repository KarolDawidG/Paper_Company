import { useState, useEffect } from 'react';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';

interface AddressTableLogicProps {
  selectedClientId: number | null;
}

export const useAddressTableLogic = ({ selectedClientId }: AddressTableLogicProps) => {
  const [addressData, setAddressData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);

  const fetchAddressData = async () => {
    if (selectedClientId) {
      try {
        const response = await axiosInstance.get(`/address/${selectedClientId}`);
        setAddressData(response.data.addressList);
      } catch (error) {
        console.error('Error fetching data:', error);
          if (isTranslationLoaded) {
            notify(`${t.notification.error}`);
            return;
        }
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await axiosInstance.delete(`/address/${addressId}`);
      if (isTranslationLoaded) {
        notify(`${t.notification.correct}`);
        return;
    }
      fetchAddressData(); 
    } catch (error: any) {
      console.error(error);
      if (isTranslationLoaded) {
        notify(`${t.notification.deleting_error}`);
        return;
    }
    }
  };

  const handleIdAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    sessionStorage.setItem("addressId", addressId);
  };

  const handleClearAddressSelect = () => {
    sessionStorage.removeItem('addressId');
    setSelectedAddressId(null);
  };

  const handleOrder = async () => {
    try {
      const client_id = sessionStorage.getItem('clientId');
      const client_address_id = sessionStorage.getItem('addressId');
      const orderData = { client_id, client_address_id };
      const response = await axiosInstance.post('/sales/new-order', orderData, {
          headers: {
              'Content-Type': 'application/json'
          }
      });      
      localStorage.setItem("order_id", response.data.order_id);
      if (isTranslationLoaded) {
        notify(`${t.notification.client_data_saved}`);
        return;
    }
    } catch (error) {
        console.error("Error:", error);
        if (isTranslationLoaded) {
          notify(`${t.notification.error}`);
          return;
      }
    }
};
  useEffect(() => {
    fetchAddressData();
  }, [selectedClientId]);

  return {
    addressData,
    selectedAddressId,
    handleDeleteAddress,
    handleIdAddress,
    handleClearAddressSelect,
    fetchAddressData,
    handleOrder
  };
};
