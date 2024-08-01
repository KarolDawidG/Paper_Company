import React, { useEffect, useState } from "react";
import { Typography, Box, Card, CardContent, LinearProgress } from '@mui/material';
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
import useTranslation from "@/app/components/language/useTranslation";

const SelectClientsData = () => {
  const [open, setOpen] = useState(false);
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

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

  if (!t.sales_and_orders) {
    return <LinearProgress />;
  }

  return (
    <Card variant="outlined">
      <CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography >
            {t.sales_and_orders.add_client}
          </Typography>

          <MainButton onClick={handleOpenAddClient}>
            {t.sales_and_orders.add_client_button}
          </MainButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography>{t.sales_and_orders.select_client}:</Typography>

          <MainButton onClick={handleClearSelect}>
            {t.sales_and_orders.clear_client}
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
          {t.sales_and_orders.add_address}
        </Typography>

        <MainButton  onClick={handleOpenAddAddress}>
          {t.sales_and_orders.add_address_button}
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
          {t.sales_and_orders.confirm_delete_client}
      </BaseDialog>
      </CardContent>
    </Card>
  );
};

export default SelectClientsData;