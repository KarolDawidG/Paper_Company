import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";

export const AddressTable = ({ selectedClientId }:any) => {
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
    
    const handleClearSelect = () => {
        sessionStorage.removeItem('addressId');
        setSelectedAddressId(null); 
    }

    useEffect(() => {
        if (selectedClientId) {
            fetchAddressData();
        }
    }, [selectedClientId]);

    return (

            <Box>
                <CardContent>
                    <Box>
                        <Typography variant="h6">Tabela adresow</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Nazwa Firmy</TableCell>
                                        <TableCell>Miasto</TableCell>
                                        <TableCell>Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addressData.map((address:any, index:number) => (
                                        <TableRow key={index} sx={{ backgroundColor: selectedAddressId === address.addressData.id ? '#666666' : 'inherit' }}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{address.addressData.nazwa_firmy}</TableCell>
                                            <TableCell>{address.addressData.miasto}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleIdAddress(address.addressData.id)}>
                                                    Select
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </CardContent>
                <Box>
                <Typography>
                    Chcesz stworzyc zamowienie dla wybranych danych?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Button onClick={() => handleOrder()} disabled={!selectedAddressId}   sx={{backgroundColor: selectedAddressId ? '#1976d2' : '#ccc', color: '#fff', '&:hover': { backgroundColor: selectedAddressId ? '#1565c0' : '#ccc',}, '&:disabled': { backgroundColor: '#ccc', color: '#666' }}}>
                        Tworz
                    </Button>

                    <Button onClick={() => handleClearSelect()} disabled={!selectedAddressId}   sx={{backgroundColor: selectedAddressId ? '#1976d2' : '#ccc', color: '#fff', '&:hover': { backgroundColor: selectedAddressId ? '#1565c0' : '#ccc',}, '&:disabled': { backgroundColor: '#ccc', color: '#666' }}}>
                        Czysc
                    </Button>
                </Box>
                </Box>
            </Box>

    );
};
