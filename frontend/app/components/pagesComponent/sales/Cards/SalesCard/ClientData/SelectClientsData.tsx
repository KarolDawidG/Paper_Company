import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Card, CardContent, Button } from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import AddClientModal from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/Modals/AddClientModal";
import { notify } from "@/app/components/notification/Notify";
import UpdateClientModal from "./Modals/UpdateClientModal";
import { AddressTable } from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/AddressTable";
import ClientTable from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/ClientTable";
import { AddDeliveryDataModal } from "./Modals/AddDeliveryDataModal";

const SelectClientsData = () => {
  const [modals, setModals] = useState({
    addClient: false,
    editClient: false,
    addAddress: false,
  });
  const [data, setData] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    first_name: "",
    second_name: "",
    email: "",
  });

  const handleOpenAddClient = () => toggleModal("addClient", true);
  const handleOpenAddAddress = () => toggleModal("addAddress", true);
  
  const handleOpenEditClient = (
    id: string,
    first_name: string,
    second_name: string,
    email: string
  ) => {
    setUpdateData({ id, first_name, second_name, email });
    toggleModal("editClient", true);
  };

  const handleIdClient = (clientId: number) => {
    setSelectedClientId(clientId);
    sessionStorage.setItem("clientId", clientId.toString());
    sessionStorage.removeItem('addressId');
  };

  const handleDelete = async (clientId: string) => {
    try {
      await axiosInstance.delete(`/client/${clientId}`);
      fetchData(); 
    } catch (error: any) {
      notify("Cannot delete user who has already made purchases.");
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/client");
      setData(response.data.clientList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleModal = (modalName: any, value: any) => {
    setModals((prev) => ({ ...prev, [modalName]: value }));
  };

  const handleClearSelect = () => {
    sessionStorage.removeItem('clientId');
    sessionStorage.removeItem('addressId');
    setSelectedClientId(null); 
}

  useEffect(() => {
    fetchData();
  }, []);

  //////////////////////////////////////////////////////////////////////

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

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Do you want to add a new client?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddClient}
          sx={{ marginBottom: 2 }}
        >
          Add Client
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography>Select a client:</Typography>
          <Button onClick={handleClearSelect} variant="contained" color="primary">
            Clear your select
          </Button>
        </Box>

        <ClientTable
          data={data}
          handleIdClient={handleIdClient}
          handleDelete={handleDelete}
          handleOpenEditClient={handleOpenEditClient}
          selectedClientId={selectedClientId}
        />

        {selectedClientId && 
        <AddressTable 
          selectedAddressId={selectedAddressId}
          addressData={addressData}
          handleIdAddress={handleIdAddress}
          handleOrder={handleOrder}
          handleClearAddresSelect={handleClearAddresSelect}
        
        />}

        <Typography variant="h6" gutterBottom>
          Do you want to add a new address?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddAddress}
        >
          Add Address
        </Button>

        {modals.addAddress && (
          <AddDeliveryDataModal
            open={true}
            onClose={() => toggleModal("addAddress", false)}
            fetchAddressData={fetchAddressData}
          />
        )}

        {modals.addClient && (
          <AddClientModal
            open={true}
            fetchData={fetchData}
            onClose={() => toggleModal("addClient", false)}
          />
        )}

        {modals.editClient && (
          <UpdateClientModal
            open={true}
            onClose={() => toggleModal("editClient", false)}
            updateData={updateData}
            fetchData={fetchData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SelectClientsData;
