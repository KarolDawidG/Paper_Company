import { useState, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";

const useAddressTableLogic = (selectedClientId:any) => {
  const [addressData, setAddressData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const fetchAddressData = async () => {
    try {
        const response = await axiosInstance.get(`/address/${selectedClientId}`);
        setAddressData(response.data.addressList);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  const handleIdAddress = (addressId: any) => {
    sessionStorage.setItem("addressId", addressId);
    setSelectedAddressId(addressId);
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
      notify("Dane klienta i adres dostawy, zostały zapisane!");
    } catch (error) {
        console.error("Błąd podczas tworzenia zamówienia:", error);
        notify("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
    }
};

const handleClearAddresSelect = () => {
    sessionStorage.removeItem('addressId');
    setSelectedAddressId(null); 
}

  useEffect(() => {
    if (selectedClientId) {
      fetchAddressData();
    }
  }, [selectedClientId]);

  return {
    addressData,
    selectedAddressId,
    handleIdAddress,
    handleOrder,
    handleClearAddresSelect,
    fetchAddressData
  };
};

export default useAddressTableLogic;
