import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Button } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import AddClientModal from "@/app/components/pagesComponent/sales/Cards/SalesCard/AddClientModal";
import { notify } from "@/app/components/notification/Notify";
import UpdateClientModal from "./UpdateClientModal";
import { AddressTable } from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/AddressTable";
import ClientTable from "@/app/components/pagesComponent/sales/Cards/SalesCard/Tables/ClientTable";

export const SelectClientsData = () => {
    const [addClient, setAddClient] = useState<boolean>();
    const [editClient, setEditClient] = useState<boolean>();
    const [data, setData] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [updateData, setUpdateData] = useState({
        id: "",
        first_name: "",
        second_name: "",
        email: ""
    });

    const handleOpenAddClient = () => {
        setAddClient(true);
    };

    const handleCloseAddClient = () => {
        setAddClient(false);
    };

    const handleOpenEditClient = (id: string, first_name: string, second_name: string, email: string) => {
        const updateData = {
            id: id,
            first_name: first_name,
            second_name: second_name,
            email: email
        };
        setUpdateData(updateData);
        setEditClient(true);
    };

    const handleCloseEditClient = () => {
        setEditClient(false);
    };

    const handleIdClient = (clientId: number) => {
        setSelectedClientId(clientId);
        sessionStorage.setItem('clientId', clientId.toString());
    };

    const handleDelete = async (clientId: string) => {
        try {
            await axiosInstance.delete(`/client/${clientId}`);
        } catch (error: any) {
            notify('Cannot delete user who has already made purchases.');
            console.error(error);
        }
    };


    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/client');
            setData(response.data.clientList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <Button onClick={() => handleOpenAddClient()}>
                Add client
            </Button>

            <Box>

                <Typography>
                    Select client:
                </Typography>

                <CardContent>
                    <ClientTable
                        data={data}
                        handleIdClient={handleIdClient}
                        handleDelete={handleDelete}
                        handleOpenEditClient={handleOpenEditClient}
                        selectedClientId={selectedClientId}
                    />
                </CardContent>

                {selectedClientId && <AddressTable selectedClientId={selectedClientId} />}

            </Box>

            {(addClient) && (
                <AddClientModal
                    open={true}
                    onClose={handleCloseAddClient}
                />
            )}

            {(editClient) && (
                <UpdateClientModal
                    open={true}
                    onClose={handleCloseEditClient}
                    updateData={updateData}
                    fetchData={fetchData}
                />
            )}
        </Box>
    );
};
