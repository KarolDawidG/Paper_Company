import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Box, Card, CardContent } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import AddClientModal from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/Modals/AddClientModal";
import { notify } from "@/app/components/notification/Notify";
import UpdateClientModal from "./Modals/UpdateClientModal";
import { AddressTable } from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/AddressTable";
import ClientTable from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/ClientTable";
import { AddDeliveryDataModal } from "./Modals/AddDeliveryDataModal";
import { useDeleteClientDialogLogic } from './Modals/DeleteClientDialogLogic';
import { useClientTableLogic } from "./Modals/ClientTableLogic";
import { useAddressTableLogic } from "./Modals/AddressTableLogic";

const SelectClientsData = () => {

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

<Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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