import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";

export const AddressTable = ({ selectedClientId }) => {
    const [addressData, setAddressData] = useState([]);

    const fetchAddressData = async () => {
        try {
            const response = await axiosInstance.get(`/address/${selectedClientId}`);
            setAddressData(response.data.addressList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (selectedClientId) {
            fetchAddressData();
        }
    }, [selectedClientId]);

    return (
            <Box>
                <CardContent>
                    <Box>
                        <Typography variant="h6">Address table</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Nazwa Firmy</TableCell>
                                        <TableCell>Miasto</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addressData.map((address, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{address.addressData.nazwa_firmy}</TableCell>
                                            <TableCell>{address.addressData.miasto}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </CardContent>
            </Box>
    );
};
