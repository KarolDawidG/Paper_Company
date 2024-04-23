import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { DisableButton } from "@/app/components/layout/Buttons";
import BaseDialog from "@/app/components/utils/BaseDialog";

export const AddressTable = ({ selectedAddressId, addressData, handleDeleteAddress, handleIdAddress, handleOrder, handleClearAddresSelect}:any) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);

    const handleOpenDialog = (id:any) => {
        setCurrentAddressId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        handleDeleteAddress(currentAddressId);
        setOpenDialog(false);
    };

    return (
    <Box>
        <CardContent>
            <Typography variant="h6">Tabela adresow</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Nazwa Firmy</TableCell>
                                <TableCell>Miasto</TableCell>
                                <TableCell>Select</TableCell>
                                <TableCell>Delete</TableCell>
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
                                        <TableCell>
                                            <Button onClick={() => handleOpenDialog(address.addressData.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                    </Table>
                </TableContainer>
                    
        </CardContent>
            <Typography>
                Chcesz stworzyc zamowienie dla wybranych danych?
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                <DisableButton onClick={() => handleOrder()} disabled={!selectedAddressId}>
                    Tworz
                </DisableButton>
                <DisableButton onClick={() => handleClearAddresSelect()} disabled={!selectedAddressId}>
                    Czysc
                </DisableButton>
            </Box>
                
            <BaseDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} title="Confirm Deletion" confirmText="Delete" cancelText="Cancel">
                Are you sure you want to delete this address? This action cannot be undone.
            </BaseDialog>
    </Box>
);
};
