import { useState, useEffect } from 'react';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";

interface AddressTableLogicProps {
  selectedClientId: number | null;
}

export const useAddressTableLogic = ({ selectedClientId }: AddressTableLogicProps) => {
  const [addressData, setAddressData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const fetchAddressData = async () => {
    if (selectedClientId) {
      try {
        const response = await axiosInstance.get(`/address/${selectedClientId}`);
        setAddressData(response.data.addressList);
      } catch (error) {
        console.error('Error fetching data:', error);
        notify("Failed to fetch address data.");
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await axiosInstance.delete(`/address/${addressId}`);
      notify("Address successfully deleted.");
      fetchAddressData(); 
    } catch (error: any) {
      notify("An error occurred while deleting the address. Please check if it is linked to any existing orders and try again.");
      console.error(error);
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
      console.log("Order ID: ");
      console.log(response.data.order_id);
      
      localStorage.setItem("order_id", response.data.order_id);
      notify("Dane klienta i adres dostawy, zostały zapisane!");
    } catch (error) {
        console.error("Błąd podczas tworzenia zamówienia:", error);
        notify("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
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
