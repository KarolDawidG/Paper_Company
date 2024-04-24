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
import  {MainButton} from "@/app/components/layout/Buttons";

const SelectClientsData = () => {
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/client");
      setData(response.data.clientList);
      console.log(response.data.clientList);
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography >
            Do you want to add a new client?
          </Typography>

          <MainButton onClick={handleOpenAddClient}>
            Add Client
          </MainButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography>Select a client:</Typography>

          <MainButton onClick={handleClearSelect}>
            Clear your select
          </MainButton>
        </Box>

        <ClientTable
          data={data}
          handleIdClient={handleIdClient}
          handleDelete={handleOpenDeleteDialog}
          handleOpenEditClient={handleOpenEditClient}
          selectedClientId={selectedClientId}
        />
      
      <Box sx={{ display: 'flex',marginTop: 2 ,justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        
        <Typography>
          Do you want to add a new address?
        </Typography>

        <MainButton  onClick={handleOpenAddAddress}>
          Add Address
        </MainButton>

      </Box>

        {selectedClientId && 
        <AddressTable 
          selectedAddressId={selectedAddressId}
          addressData={addressData}
          handleIdAddress={handleIdAddress}
          handleOrder={handleOrder}
          handleDeleteAddress={handleDeleteAddress}
          handleClearAddresSelect={handleClearAddressSelect}
        />}
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
      <BaseDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleConfirm} title="Confirm Deletion" confirmText="Delete" cancelText="Cancel">
        Are you sure you want to delete this client? This action cannot be undone.
      </BaseDialog>
      </CardContent>
    </Card>
  );
};

export default SelectClientsData;