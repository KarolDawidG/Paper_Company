import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, CardContent, Button, Divider } from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import AddClientModal from "@/app/components/pagesComponent/sales/Cards/SalesCard/ClientData/AddClientModal";
import { notify } from "@/app/components/notification/Notify";
import UpdateClientModal from "./UpdateClientModal";
import { AddressTable } from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/AddressTable";
import ClientTable from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/ClientTable";
import { AddDeliveryDataModal } from "../DeliveryData/AddDeliveryDataModal";

export const SelectClientsData = () => {
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
  };

  const handleDelete = async (clientId: string) => {
    try {
      await axiosInstance.delete(`/client/${clientId}`);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Do you want to add new client?</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenAddClient()}
      >
        Add client
      </Button>

      <Box>
        <Typography>Select client:</Typography>

        <CardContent>
          <ClientTable
            data={data}
            handleIdClient={handleIdClient}
            handleDelete={handleDelete}
            handleOpenEditClient={handleOpenEditClient}
            selectedClientId={selectedClientId}
          />
        </CardContent>

        {selectedClientId && (
          <AddressTable selectedClientId={selectedClientId} />
        )}
      </Box>

      <Typography variant="h6">Do you want to add new address?</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenAddAddress()}
      >
        Add address
      </Button>

      {modals.addAddress && (
        <AddDeliveryDataModal
          open={true}
          onClose={() => toggleModal("addAddress", false)}
        />
      )}

      {modals.addClient && (
        <AddClientModal
          open={true}
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
    </Box>
  );
};
