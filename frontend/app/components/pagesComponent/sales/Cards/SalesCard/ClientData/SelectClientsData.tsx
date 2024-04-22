import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Card, CardContent } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import AddClientModal from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/Modals/AddClientModal";
import UpdateClientModal from "./Modals/UpdateClientModal";
import { AddressTable } from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/AddressTable";
import ClientTable from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/ClientTable";
import { AddDeliveryDataModal } from "./Modals/AddDeliveryDataModal";
import { useDeleteClientDialogLogic } from '../Logic/DeleteClientDialogLogic';
import { useClientTableLogic } from "../Logic/ClientTableLogic";
import { useAddressTableLogic } from "../Logic/AddressTableLogic";
import BaseDialog from '../../../../../utils/BaseDialog';

const SelectClientsData = () => {
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/client");
      setData(response.data.clientList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};
  const { openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog, handleDelete } = useDeleteClientDialogLogic({ fetchData });
  const { selectedClientId, setSelectedClientId, updateData, modals, handleOpenAddClient, handleOpenAddAddress, handleOpenEditClient, handleIdClient, toggleModal } = useClientTableLogic({ fetchData });
  const { handleOrder, addressData, selectedAddressId, handleDeleteAddress, handleIdAddress, handleClearAddressSelect, fetchAddressData } = useAddressTableLogic({ selectedClientId });
  
  const [data, setData] = useState<any[]>([]);

  const handleClearSelect = () => {
    sessionStorage.removeItem('clientId');
    sessionStorage.removeItem('addressId');
    setSelectedClientId(null); 
}

const handleClose = () => setOpen(false);
const handleConfirm = () => {
  handleDelete();
  handleClose();
};

  useEffect(() => {
    fetchData();
  }, []);

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
          handleDelete={handleOpenDeleteDialog}
          handleOpenEditClient={handleOpenEditClient}
          selectedClientId={selectedClientId}
        />
      
      <BaseDialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
        onConfirm={handleConfirm} 
        title="Confirm Deletion" 
        confirmText="Delete"
        cancelText="Cancel"
      >
        Are you sure you want to delete this client? This action cannot be undone.
      </BaseDialog>
       

        {selectedClientId && 
        <AddressTable 
          selectedAddressId={selectedAddressId}
          addressData={addressData}
          handleIdAddress={handleIdAddress}
          handleOrder={handleOrder}
          handleDeleteAddress={handleDeleteAddress}
          handleClearAddresSelect={handleClearAddressSelect}
        
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